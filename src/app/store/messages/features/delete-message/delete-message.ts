import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { DeleteMessageReq, DeleteMessagesApiReq } from '../../models';
import { DeleteMessageSuccess } from './delete-message-success';

export class DeleteMessage {
  static get action() {
    return createAction('DELETE_MESSAGE')<DeleteMessageReq>();
  }

  static get saga() {
    return function* deleteMessageSaga(action: ReturnType<typeof DeleteMessage.action>): SagaIterator {
      const { status } = DeleteMessage.httpRequest.call(yield call(() => DeleteMessage.httpRequest.generator({ ids: action.payload.messageIds })));

      if (status === HTTPStatusCode.OK) {
        yield put(DeleteMessageSuccess.action(action.payload));
      } else {
        alert('deleteMessageSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, DeleteMessagesApiReq>(`${ApiBasePath.MainApi}/api/messages/delete-message-list`, HttpRequestMethod.Post);
  }
}
