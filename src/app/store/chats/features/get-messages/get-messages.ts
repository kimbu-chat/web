import { getSelectedChatSelector } from 'store/chats/selectors';
import { IChatsState } from 'store/chats/models';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IMessage, IMessageList, IMessagesReqData, MessageState } from '../../models';
import { IGetMessagesActionPayload } from './get-messages-action-payload';
import { GetMessagesSuccess } from './get-messages-success';

export class GetMessages {
  static get action() {
    return createAction('GET_MESSAGES')<IGetMessagesActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.loading = true;
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetMessages.action>): SagaIterator {
      const { page } = action.payload;

      const chat = yield select(getSelectedChatSelector);

      if (chat) {
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
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage[]>, IMessagesReqData>(`${process.env.MAIN_API}/api/messages/search`, HttpRequestMethod.Post);
  }
}
