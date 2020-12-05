import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { GetCallsActionData, Call, GetCallsApiRequest } from '../../models';
import { GetCallsSuccess } from './get-calls-success';

export class GetCalls {
  static get action() {
    return createAction('GET_CALLS')<GetCallsActionData>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetCalls.action>): SagaIterator {
      const { page } = action.payload;

      const { data, status } = GetCalls.httpRequest.call(yield call(() => GetCalls.httpRequest.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetCallsSuccess.action({ calls: data, hasMore }));
      } else {
        alert('getCallsSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Call[]>, GetCallsApiRequest>(`${ApiBasePath.MainApi}/api/calls/search`, HttpRequestMethod.Post);
  }
}
