import { createAction } from 'typesafe-actions';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { IMessage } from '../../models';

import { getChatLastMessageIdSelector, getChatMessagesLengthSelector } from '../../selectors';
import { IMessagesDeletedIntegrationEvent } from './messages-deleted-integration-event';
import { IGetLastMessageByChatIdApiRequest } from './api-requests/get-last-message-by-chat-id-api-request';
import { MessagesDeletedIntegrationEventHandlerSuccess } from './messages-deleted-integration-event-handler-success';

export class MessagesDeletedIntegrationEventHandler {
  static get action() {
    return createAction('MessagesDeleted')<IMessagesDeletedIntegrationEvent>();
  }

  static get saga() {
    return function* messagesDeleteSaga(
      action: ReturnType<typeof MessagesDeletedIntegrationEventHandler.action>,
    ): SagaIterator {
      const { chatId, messageIds } = action.payload;
      const lastMessageId = yield select(getChatLastMessageIdSelector(chatId));
      const messageListIsEmpty = (yield select(getChatMessagesLengthSelector(chatId))) === 0;
      let newLastMessage: IMessage | null = null;

      if (messageIds.includes(lastMessageId) && messageListIsEmpty) {
        const {
          data,
        }: AxiosResponse<IMessage> = MessagesDeletedIntegrationEventHandler.httpRequest.call(
          yield call(() =>
            MessagesDeletedIntegrationEventHandler.httpRequest.generator({ chatId }),
          ),
        );

        newLastMessage = data;
      }

      yield put(
        MessagesDeletedIntegrationEventHandlerSuccess.action({
          chatNewLastMessage: newLastMessage,
          chatId,
          messageIds,
        }),
      );
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage>, IGetLastMessageByChatIdApiRequest>(
      ({ chatId }: IGetLastMessageByChatIdApiRequest) =>
        `${process.env.MAIN_API}/api/chats/${chatId}/last-message`,
      HttpRequestMethod.Get,
    );
  }
}
