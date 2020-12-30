import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IMarkMessagesAsReadRequest } from '../../models';
import { IMarkMessagesAsReadActionPayload } from './mark-messages-as-read-action-payload';
import { MarkMessagesAsReadSuccess } from './mark-messages-as-read-success';

export class MarkMessagesAsRead {
  static get action() {
    return createAction('RESET_UNREAD_MESSAGES_COUNT')<IMarkMessagesAsReadActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof MarkMessagesAsRead.action>): SagaIterator {
      MarkMessagesAsRead.httpRequest.call(yield call(() => MarkMessagesAsRead.httpRequest.generator(action.payload)));

      yield put(MarkMessagesAsReadSuccess.action(action.payload));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IMarkMessagesAsReadRequest>(`${ApiBasePath.MainApi}/api/chats/mark-as-read`, HttpRequestMethod.Post);
  }
}
