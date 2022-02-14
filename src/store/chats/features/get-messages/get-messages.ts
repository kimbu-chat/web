import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IUser, IMessage, IGetMessagesRequest } from 'kimbu-models';
import { size } from 'lodash';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { put, call, select, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { MessageState, INormalizedMessage } from '@store/chats/models';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { MESSAGES_LIMIT } from '@utils/pagination-limits';

import { IChatsState } from '../../chats-state';
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

        if (payload.initializedByScroll && !chat.messages.hasMore) {
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
      const { initializedByScroll } = action.payload;

      const isFirstChatsLoad = yield select(getIsFirstChatsLoadSelector);

      if (isFirstChatsLoad) {
        yield take(GetChatsSuccess.action);
      }

      const chat = yield select(getSelectedChatSelector);

      if (!chat) {
        return;
      }

      if (initializedByScroll && !chat.messages.hasMore) {
        return;
      }

      const searchString = yield select(getSelectedChatMessagesSearchStringSelector);

      if (chat) {
        const request: IGetMessagesRequest = {
          page: {
            limit: MESSAGES_LIMIT,
            offset: initializedByScroll ? size(chat.messages.messageIds) : 0,
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
              chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= message.id
                ? MessageState.READ
                : MessageState.SENT,
          }));

          const {
            entities: { messages, users },
            result,
          } = normalize<
            IMessage[],
            { messages: Record<number, INormalizedMessage>; users: Record<number, IUser> },
            number[]
          >(newMessages, messageArrNormalizationSchema);

          const messageList = {
            chatId: chat.id,
            messages: messages || {},
            messageIds: result,
            hasMoreMessages: newMessages.length >= MESSAGES_LIMIT,
            searchString,
            initializedByScroll,
          };

          yield put(AddOrUpdateUsers.action({ users }));
          yield put(GetMessagesSuccess.action(messageList));
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
