import { AxiosResponse } from 'axios';
import { IClearChatRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { HTTPStatusCode } from '../../../../common/http-status-code';

import { ClearChatHistorySuccess } from './clear-chat-history-success';

export interface IClearChatHistoryActionPayload {
  forEveryone: boolean;
  chatId: number;
}

export class ClearChatHistory {
  static get action() {
    return createDeferredAction<IClearChatHistoryActionPayload>('CLEAR_CHAT_HISTORY');
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
    return httpRequestFactory<AxiosResponse, IClearChatRequest>(
      MAIN_API.CLEAR_CHAT_HISTORY,
      HttpRequestMethod.Post,
    );
  }
}
