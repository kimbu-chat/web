import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { getSelectedChatIdSelector } from '../../selectors';

import { IDeleteMessageActionPayload } from './action-payloads/delete-message-action-payload';
import { IDeleteMessagesApiRequest } from './api-requests/delete-message-api-request';
import { DeleteMessageSuccess } from './delete-message-success';

export class DeleteMessage {
  static get action() {
    return createAction('DELETE_MESSAGE')<IDeleteMessageActionPayload>();
  }

  static get saga() {
    return function* deleteMessageSaga(
      action: ReturnType<typeof DeleteMessage.action>,
    ): SagaIterator {
      const { messageIds, forEveryone } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      const { status } = DeleteMessage.httpRequest.call(
        yield call(() => DeleteMessage.httpRequest.generator({ ids: messageIds, forEveryone })),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(DeleteMessageSuccess.action({ messageIds, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IDeleteMessagesApiRequest>(
      MAIN_API.DELETE_MESSAGES,
      HttpRequestMethod.Post,
    );
  }
}
