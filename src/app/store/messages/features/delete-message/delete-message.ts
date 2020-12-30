import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IDeleteMessagesApiReq } from '../../models';
import { IDeleteMessageActionPayload } from './delete-message-action-payload';
import { DeleteMessageSuccess } from './delete-message-success';

export class DeleteMessage {
  static get action() {
    return createAction('DELETE_MESSAGE')<IDeleteMessageActionPayload>();
  }

  static get saga() {
    return function* deleteMessageSaga(action: ReturnType<typeof DeleteMessage.action>): SagaIterator {
      const { status } = DeleteMessage.httpRequest.call(
        yield call(() => DeleteMessage.httpRequest.generator({ ids: action.payload.messageIds, forEveryone: action.payload.forEveryone })),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(DeleteMessageSuccess.action(action.payload));
      } else {
        alert('deleteMessageSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IDeleteMessagesApiReq>(`${ApiBasePath.MainApi}/api/messages/delete-message-list`, HttpRequestMethod.Post);
  }
}
