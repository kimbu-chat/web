import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { ICall, ICallState } from '../../models';
import { IGetCallsActionPayload } from './action-payloads/get-calls-action-payload';
import { GetCallsSuccess } from './get-calls-success';
import { IGetCallsApiRequest } from './api-requests/get-calls-api-requests';

export class GetCalls {
  static get action() {
    return createAction('GET_CALLS')<IGetCallsActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallState) => {
      draft.calls.loading = false;
    });
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
    return httpRequestFactory<AxiosResponse<ICall[]>, IGetCallsApiRequest>(`${process.env.MAIN_API}/api/calls/search`, HttpRequestMethod.Post);
  }
}
