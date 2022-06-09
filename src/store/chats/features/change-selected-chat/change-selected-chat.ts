import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IChat, IUser } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { INormalizedChat } from '@store/chats/models';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { MESSAGES_LIMIT } from '@utils/pagination-limits';
import { replaceInUrl } from '@utils/replace-in-url';

import { IChatsState } from '../../chats-state';
import { chatNormalizationSchema } from '../../normalization';
import {
  getChatByIdDraftSelector,
  getChatByIdSelector,
  getIsFirstChatsLoadSelector,
} from '../../selectors';
import { GetChatsSuccess } from '../get-chats/get-chats-success';
import { UnshiftChat } from '../unshift-chat/unshift-chat';

export interface IChangeSelectedChatActionPayload {
  newChatId?: number;
}

export class ChangeSelectedChat {
  static get action() {
    return createAction<IChangeSelectedChatActionPayload>('CHANGE_SELECTED_CHAT');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof ChangeSelectedChat.action>) => {
      const { newChatId } = payload;

      draft.chatInfo = {
        isInfoOpened: false,
      };

      const oldChatId = draft.selectedChatId;

      if (oldChatId) {
        const chat = getChatByIdDraftSelector(oldChatId, draft);
        const oldChatMessages = draft.chats[oldChatId]?.messages;

        if (oldChatMessages) {
          if (oldChatMessages.searchString?.length) {
            oldChatMessages.searchString = '';
            oldChatMessages.messages = {};
            oldChatMessages.messageIds = [];
            oldChatMessages.hasMore = true;
          } else if (chat && (oldChatMessages?.messageIds.length || 0) > MESSAGES_LIMIT) {
            const messageIdsToDelete = oldChatMessages.messageIds.slice(
              30,
              oldChatMessages.messageIds.length - 1,
            );

            messageIdsToDelete.forEach((messageId) => {
              delete oldChatMessages?.messages[messageId];
            });

            oldChatMessages.messageIds = oldChatMessages.messageIds.slice(0, 30);
            oldChatMessages.hasMore = true;
          }
        }
      }

      draft.selectedChatId = newChatId;

      // We have to check if chat exists in Record<number, IChat> reducer then we will not request it from server
      if (newChatId) {
        if (
          !draft.chatList.chatIds.includes(newChatId) &&
          draft.chats[newChatId] &&
          !draft.chats[newChatId]?.isGeneratedLocally
        ) {
          draft.chatList.chatIds.unshift(newChatId);
        }
      }

      draft.selectedMessageIds = [];

      return draft;
    };
  }

  static get saga() {
    return function* changeSelectedChatSaga(
      action: ReturnType<typeof ChangeSelectedChat.action>,
    ): SagaIterator {
      if (action.payload.newChatId !== null && !Number.isNaN(action.payload.newChatId)) {
        const isFirstChatsLoad = yield select(getIsFirstChatsLoadSelector);

        if (!action.payload.newChatId) {
          return;
        }

        if (isFirstChatsLoad) {
          yield take(GetChatsSuccess.action);
        }

        const chat = yield select(getChatByIdSelector(action.payload.newChatId));
        const chatExists = chat !== undefined && !chat.isGeneratedLocally;
        if (!chatExists) {
          const { data } = ChangeSelectedChat.httpRequest.call(
            yield call(() => ChangeSelectedChat.httpRequest.generator(action.payload.newChatId)),
          );

          const {
            entities: { chats, users },
          } = normalize<
            IChat[],
            { chats?: Record<number, INormalizedChat>; users: Record<number, IUser> },
            number[]
          >(data, chatNormalizationSchema);

          yield put(AddOrUpdateUsers.action({ users }));

          if (chats) {
            const normalizedChat: INormalizedChat = chats[data.id as number];

            yield put(UnshiftChat.action({ chat: normalizedChat, addToList: true }));
          }
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IChat>, number>(
      (chatId: number) => replaceInUrl(MAIN_API.GET_CHAT, ['chatId', chatId]),
      HttpRequestMethod.Get,
    );
  }
}
