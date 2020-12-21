import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { Message, MessageList, MessagesReqData, MessagesState, MessageState } from '../../models';
import { GetMessagesActionPayload } from './get-messages-action-payload';
import { GetMessagesSuccess } from './get-messages-success';

export class GetMessages {
  static get action() {
    return createAction('GET_MESSAGES')<GetMessagesActionPayload>();
  }

  static get reducer() {
    return produce((draft: MessagesState) => {
      draft.loading = true;
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetMessages.action>): SagaIterator {
      const { page, chat } = action.payload;

      const request: MessagesReqData = {
        page,
        chatId: chat.id,
      };

      const { data } = GetMessages.httpRequest.call(yield call(() => GetMessages.httpRequest.generator(request)));

      data.forEach((message) => {
        message.state = chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= message.id ? MessageState.READ : MessageState.SENT;
      });
      const messageList: MessageList = {
        chatId: chat.id,
        messages: data,
        hasMoreMessages: data.length >= page.limit,
      };

      yield put(GetMessagesSuccess.action(messageList));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Message[]>, MessagesReqData>(`${ApiBasePath.MainApi}/api/messages/search`, HttpRequestMethod.Post);
  }
}
