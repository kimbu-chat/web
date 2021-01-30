import { getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IClearChatHistoryActionPayload } from './action-payloads/clear-chat-history-action-payload';
import { ClearChatHistorySuccess } from './clear-chat-history-success';
import { IClearChatHistoryApiRequest } from './api-requests/clear-chat-history-api-request';

export class ClearChatHistory {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY')<IClearChatHistoryActionPayload>();
  }

  static get saga() {
    return function* clearChatSaga(action: ReturnType<typeof ClearChatHistory.action>): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);

      const { status } = ClearChatHistory.httpRequest.call(
        yield call(() => ClearChatHistory.httpRequest.generator({ chatId, forEveryone: action.payload.forEveryone })),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(ClearChatHistorySuccess.action({ chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IClearChatHistoryApiRequest>(`${process.env.MAIN_API}/api/chats/clear`, HttpRequestMethod.Post);
  }
}
