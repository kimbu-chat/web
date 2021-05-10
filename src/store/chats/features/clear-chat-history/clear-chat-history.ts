import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IClearChatHistoryActionPayload } from './action-payloads/clear-chat-history-action-payload';
import { ClearChatHistorySuccess } from './clear-chat-history-success';
import { IClearChatHistoryApiRequest } from './api-requests/clear-chat-history-api-request';

export class ClearChatHistory {
  static get action() {
    return createAction('CLEAR_CHAT_HISTORY')<IClearChatHistoryActionPayload, Meta>();
  }

  static get saga() {
    return function* clearChatSaga(
      action: ReturnType<typeof ClearChatHistory.action>,
    ): SagaIterator {
      const { chatId, forEveryone } = action.payload;

      const { status } = ClearChatHistory.httpRequest.call(
        yield call(() =>
          ClearChatHistory.httpRequest.generator({
            chatId,
            forEveryone,
          }),
        ),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(ClearChatHistorySuccess.action({ chatId }));
        action.meta.deferred?.resolve();
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IClearChatHistoryApiRequest>(
      MAIN_API.CLEAR_CHAT_HISTORY,
      HttpRequestMethod.Post,
    );
  }
}
