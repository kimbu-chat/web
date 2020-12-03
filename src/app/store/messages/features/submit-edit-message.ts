import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { EditMessageApiReq, MessagesState, SubmitEditMessageReq } from '../models';
import { SubmitEditMessageSuccess } from './sumbit-edit-message-success';

export class SubmitEditMessage {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE')<SubmitEditMessageReq>();
  }

  static get reducer() {
    return produce((draft: MessagesState) => {
      draft.selectedMessageIds = [];

      draft.messageToEdit = undefined;

      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof SubmitEditMessage.action>): SagaIterator {
      const { httpRequest } = SubmitEditMessage;
      const editRequest: EditMessageApiReq = {
        text: action.payload.text,
        messageId: action.payload.messageId,
        removedAttachments: action.payload.removedAttachments,
        newAttachments: action.payload.newAttachments,
      };

      const { status } = httpRequest.call(yield call(() => httpRequest.generator(editRequest)));

      if (status === HTTPStatusCode.OK) {
        yield put(SubmitEditMessageSuccess.action(action.payload));
      } else {
        alert('editMessageSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, EditMessageApiReq>(`${ApiBasePath.MainApi}/api/messages`, HttpRequestMethod.Put);
  }
}
