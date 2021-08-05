import { AxiosResponse } from 'axios';
import { IUser, IMessage } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { INormalizedMessage } from '@store/chats/models';
import { ById } from '@store/chats/models/by-id';
import { messageNormalizationSchema } from '@store/chats/normalization';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';

import { AddOrUpdateUsers } from '../../../users/features/add-or-update-users/add-or-update-users';
import { getChatLastMessageIdSelector, getChatMessagesLengthSelector } from '../../selectors';

import { MessagesDeletedIntegrationEventHandlerSuccess } from './messages-deleted-integration-event-handler-success';
import { IMessagesDeletedIntegrationEvent } from './messages-deleted-integration-event';

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

      if (lastMessageId && messageListIsEmpty) {
        const { data }: AxiosResponse<IMessage> =
          MessagesDeletedIntegrationEventHandler.httpRequest.call(
            yield call(() => MessagesDeletedIntegrationEventHandler.httpRequest.generator(chatId)),
          );

        const {
          entities: { messages, users },
        } = normalize<
          IMessage[],
          { messages: ById<INormalizedMessage>; users: ById<IUser> },
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
      (chatId: number) => replaceInUrl(MAIN_API.MESSAGE_DELETED_EVENT, ['chatId', chatId]),
      HttpRequestMethod.Get,
    );
  }
}
