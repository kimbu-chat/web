import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { CleatChatHistoryReq } from '../../models';
import { ClearChatHistorySuccess } from './clear-chat-history-success';

export class ClearChatHistory {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY')<CleatChatHistoryReq>();
  }

  static get saga() {
    return function* clearChatSaga(action: ReturnType<typeof ClearChatHistory.action>): SagaIterator {
      const { status } = ClearChatHistory.httpRequest.call(yield call(() => ClearChatHistory.httpRequest.generator(action.payload)));

      if (status === HTTPStatusCode.OK) {
        yield put(ClearChatHistorySuccess.action(action.payload));
      } else {
        alert('clearChatSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, CleatChatHistoryReq>(`${ApiBasePath.MainApi}/api/chats/clear`, HttpRequestMethod.Post);
  }
}
