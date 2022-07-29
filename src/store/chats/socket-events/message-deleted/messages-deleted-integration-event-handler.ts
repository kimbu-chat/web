import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IUser, IMessage } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { INormalizedMessage } from '@store/chats/models';
import { messageNormalizationSchema } from '@store/chats/normalization';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';

import { AddOrUpdateUsers } from '../../../users/features/add-or-update-users/add-or-update-users';
import {
  getChatLastMessageIdSelector,
  getChatMessagesLengthSelector,
  getSelectedChatMessagesSearchStringSelector,
} from '../../selectors';

import { MessagesDeletedIntegrationEventHandlerSuccess } from './messages-deleted-integration-event-handler-success';
import { IMessagesDeletedIntegrationEvent } from './messages-deleted-integration-event';

export class MessagesDeletedIntegrationEventHandler {
  static get action() {
    return createAction<IMessagesDeletedIntegrationEvent>('MessagesDeleted');
  }

  static get saga() {
    return function* messagesDeleteSaga(
      action: ReturnType<typeof MessagesDeletedIntegrationEventHandler.action>,
    ): SagaIterator {
      const { chatId, messageIds } = action.payload;
      const lastMessageId = yield select(getChatLastMessageIdSelector(chatId));
      const isMessageListEmpty = (yield select(getChatMessagesLengthSelector(chatId))) === 0;
      const isSearchStringEmpty = !(yield select(getSelectedChatMessagesSearchStringSelector));

      if ((lastMessageId && isMessageListEmpty) || !isSearchStringEmpty) {
        const { data }: AxiosResponse<IMessage> =
          MessagesDeletedIntegrationEventHandler.httpRequest.call(
            yield call(() => MessagesDeletedIntegrationEventHandler.httpRequest.generator(chatId)),
          );

        const {
          entities: { messages, users },
        } = normalize<
          IMessage[],
          { messages: Record<number, INormalizedMessage>; users: Record<number, IUser> },
          number[]
        >(data, messageNormalizationSchema);

        const message = messages[data.id];

        if (message) {
          yield put(
            MessagesDeletedIntegrationEventHandlerSuccess.action({
              chatNewLastMessage: message,
              chatId,
              messageIds,
            }),
          );
        }

        yield put(AddOrUpdateUsers.action({ users }));
      } else {
        yield put(
          MessagesDeletedIntegrationEventHandlerSuccess.action({
            chatNewLastMessage: null,
            chatId,
            messageIds,
          }),
        );
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage>, number>(
      (chatId: number) => replaceInUrl(MAIN_API.GET_CHAT_LATEST_MESSAGE, ['chatId', chatId]),
      HttpRequestMethod.Get,
    );
  }
}
