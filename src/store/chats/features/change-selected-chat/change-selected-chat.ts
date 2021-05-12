import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';
import { MAIN_API } from '@common/paths';
import { normalize } from 'normalizr';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { ById } from '@store/chats/models/by-id';
import { chatNormalizationSchema } from '../../normalization';
import {
  getChatByIdSelector,
  getChatByIdDraftSelector,
  getIsFirstChatsLoadSelector,
} from '../../selectors';
import { IUser } from '../../../common/models';
import { MESSAGES_LIMIT } from '../../../../utils/pagination-limits';
import { IChat, INormalizedChat } from '../../models';
import { GetChatsSuccess } from '../get-chats/get-chats-success';
import { IChangeSelectedChatActionPayload } from './action-payloads/change-selected-chat-action-payload';
import { IGetChatByIdApiRequest } from './api-requests/get-chat-by-id-api-request';
import { UnshiftChat } from '../unshift-chat/unshift-chat';
import { IChatsState } from '../../chats-state';
import { modelChatList } from '../../utils/model-chat-list';

export class ChangeSelectedChat {
  static get action() {
    return createAction('CHANGE_SELECTED_CHAT')<IChangeSelectedChatActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof ChangeSelectedChat.action>) => {
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
            } else if (chat && (oldChatMessages?.messageIds.length || 0) > MESSAGES_LIMIT) {
              const messageIdsToDelete = oldChatMessages.messageIds.slice(
                30,
                oldChatMessages.messageIds.length - 1,
              );

              messageIdsToDelete.forEach((messageId) => {
                delete oldChatMessages?.messages[messageId];
              });

              oldChatMessages.messageIds = oldChatMessages.messageIds.slice(0, 30);
            }

            oldChatMessages.hasMore = true;
          }
        }

        draft.selectedChatId = newChatId;

        // We have to check if chat exists in ById<IChat> reducer then we will not request it from server
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
      },
    );
  }

  static get saga() {
    return function* changeSelectedChatSaga(
      action: ReturnType<typeof ChangeSelectedChat.action>,
    ): SagaIterator {
      if (action.payload.newChatId !== null && !Number.isNaN(action.payload.newChatId)) {
        const isFirstChatsLoad = yield select(getIsFirstChatsLoadSelector);

        if (isFirstChatsLoad) {
          yield take(GetChatsSuccess.action);
        }

        const chat = yield select(getChatByIdSelector(action.payload.newChatId));
        const chatExists = chat !== undefined && !chat.isGeneratedLocally;
        if (!chatExists) {
          const { data } = ChangeSelectedChat.httpRequest.call(
            yield call(() =>
              ChangeSelectedChat.httpRequest.generator({
                chatId: action.payload.newChatId as number,
              }),
            ),
          );

          const {
            entities: { chats, users },
          } = normalize<IChat[], { chats?: ById<INormalizedChat>; users: ById<IUser> }, number[]>(
            data,
            chatNormalizationSchema,
          );

          const modeledChat = modelChatList(chats)[data.id];

          yield put(UnshiftChat.action({ chat: modeledChat as INormalizedChat, addToList: true }));
          yield put(AddOrUpdateUsers.action({ users }));
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IChat>, IGetChatByIdApiRequest>(
      ({ chatId }: IGetChatByIdApiRequest) => replaceInUrl(MAIN_API.GET_CHAT, ['chatId', chatId]),
      HttpRequestMethod.Get,
    );
  }
}
