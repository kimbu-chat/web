import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';

import { HTTPStatusCode } from '../../../../common/http-status-code';

import { DeleteCallSuccess } from './delete-call-success';

export interface IDeleteCallActionPayload {
  id: number;
}

export class DeleteCall {
  static get action() {
    return createAction<IDeleteCallActionPayload>('DELETE_CALL');
  }

  static get saga() {
    return function* deleteCallSaga(action: ReturnType<typeof DeleteCall.action>): SagaIterator {
      const { id: idToDelete } = action.payload;

      const response = DeleteCall.httpRequest.call(
        yield call(() => DeleteCall.httpRequest.generator(idToDelete)),
      );

      if (response.status === HTTPStatusCode.OK) {
        yield put(DeleteCallSuccess.action({ id: idToDelete }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, number>(
      (id) => replaceInUrl(MAIN_API.DELETE_CALL, ['callId', id]),
      HttpRequestMethod.Delete,
    );
  }
}
