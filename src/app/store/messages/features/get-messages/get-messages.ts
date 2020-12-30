import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IMessage, IMessageList, IMessagesReqData, IMessagesState, MessageState } from '../../models';
import { IGetMessagesActionPayload } from './get-messages-action-payload';
import { GetMessagesSuccess } from './get-messages-success';

export class GetMessages {
  static get action() {
    return createAction('GET_MESSAGES')<IGetMessagesActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState) => {
      draft.loading = true;
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetMessages.action>): SagaIterator {
      const { page, chat } = action.payload;

      const request: IMessagesReqData = {
        page,
        chatId: chat.id,
      };

      const { data } = GetMessages.httpRequest.call(yield call(() => GetMessages.httpRequest.generator(request)));

      data.forEach((message) => {
        message.state = chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= message.id ? MessageState.READ : MessageState.SENT;
      });
      const messageList: IMessageList = {
        chatId: chat.id,
        messages: data,
        hasMoreMessages: data.length >= page.limit,
      };

      yield put(GetMessagesSuccess.action(messageList));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage[]>, IMessagesReqData>(`${ApiBasePath.MainApi}/api/messages/search`, HttpRequestMethod.Post);
  }
}
