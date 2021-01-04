import { getSelectedChatSelector } from 'store/chats/selectors';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createEmptyAction } from 'app/store/common/actions';
import { IMarkMessagesAsReadRequest } from '../../models';
import { MarkMessagesAsReadSuccess } from './mark-messages-as-read-success';

export class MarkMessagesAsRead {
  static get action() {
    return createEmptyAction('RESET_UNREAD_MESSAGES_COUNT_FOR_SELECTED_CHAT');
  }

  static get saga() {
    return function* (): SagaIterator {
      const chat = yield select(getSelectedChatSelector);
      const chatId = chat.id;
      const lastReadMessageId = chat.messages.messages[0].id;

      MarkMessagesAsRead.httpRequest.call(yield call(() => MarkMessagesAsRead.httpRequest.generator({ chatId, lastReadMessageId })));

      yield put(MarkMessagesAsReadSuccess.action({ chatId, lastReadMessageId }));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IMarkMessagesAsReadRequest>(`${process.env.MAIN_API}/api/chats/mark-as-read`, HttpRequestMethod.Post);
  }
}
