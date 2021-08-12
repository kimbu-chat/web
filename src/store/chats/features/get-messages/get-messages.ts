import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IUser, IMessage, IGetMessagesRequest } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { put, call, select, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { MessageState } from '@store/chats/models';
import { ById } from '@store/chats/models/by-id';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { MESSAGES_LIMIT } from '@utils/pagination-limits';

import { IChatsState } from '../../chats-state';
import { INormalizedMessage } from '../../models/normalized-message';
import { messageArrNormalizationSchema } from '../../normalization';
import {
  getIsFirstChatsLoadSelector,
  getSelectedChatMessagesSearchStringSelector,
  getSelectedChatSelector,
} from '../../selectors';
import { GetChatsSuccess } from '../get-chats/get-chats-success';

import { IGetMessagesActionPayload } from './action-payloads/get-messages-action-payload';
import { GetMessagesFailure } from './get-messages-failure';
import { GetMessagesSuccess } from './get-messages-success';

export class GetMessages {
  static get action() {
    return createAction('GET_MESSAGES')<IGetMessagesActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetMessages.action>) => {
      if (draft.selectedChatId) {
        const chat = draft.chats[draft.selectedChatId];

        if (!chat) {
          return draft;
        }

        const selectedChatMessages = chat.messages;

        if (payload.isFromScroll && !chat.messages.hasMore) {
          return draft;
        }

        if (selectedChatMessages) {
          selectedChatMessages.loading = true;

          selectedChatMessages.searchString = payload.searchString;
        }
      }
      return draft;
    });
  }

  static get saga() {
    return function* getMessages(action: ReturnType<typeof GetMessages.action>): SagaIterator {
      const { isFromScroll } = action.payload;

      const isFirstChatsLoad = yield select(getIsFirstChatsLoadSelector);

      if (isFirstChatsLoad) {
        yield take(GetChatsSuccess.action);
      }

      const chat = yield select(getSelectedChatSelector);

      if (!chat) {
        return;
      }

      if (isFromScroll && !chat.messages.hasMore) {
        return;
      }

      const searchString = yield select(getSelectedChatMessagesSearchStringSelector);

      if (chat) {
        const request: IGetMessagesRequest = {
          page: {
            limit: MESSAGES_LIMIT,
            offset: isFromScroll ? chat.messages.messageIds?.length || 0 : 0,
          },
          chatId: chat.id,
          searchString,
        };

        try {
          const { data } = GetMessages.httpRequest.call(
            yield call(() => GetMessages.httpRequest.generator(request)),
          );

          const newMessages = data.map((message) => ({
            ...message,
            state:
              chat.interlocutorIdLastReadMessageId &&
              chat.interlocutorIdLastReadMessageId >= message.id
                ? MessageState.READ
                : MessageState.SENT,
          }));

          const {
            entities: { messages, users },
            result,
          } = normalize<
            IMessage[],
            { messages: ById<INormalizedMessage>; users: ById<IUser> },
            number[]
          >(newMessages, messageArrNormalizationSchema);

          const messageList = {
            chatId: chat.id,
            messages: messages || {},
            messageIds: result,
            hasMoreMessages: newMessages.length >= MESSAGES_LIMIT,
            searchString,
            isFromScroll,
          };

          yield put(GetMessagesSuccess.action({ messageList }));
          yield put(AddOrUpdateUsers.action({ users }));
        } catch {
          yield put(GetMessagesFailure.action(chat.id));
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage[]>, IGetMessagesRequest>(
      MAIN_API.GET_MESSAGES,
      HttpRequestMethod.Post,
    );
  }
}
