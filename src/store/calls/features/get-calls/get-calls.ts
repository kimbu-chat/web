import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { ICall } from '../../common/models';
import { IGetCallsActionPayload } from './action-payloads/get-calls-action-payload';
import { GetCallsSuccess } from './get-calls-success';
import { IGetCallsApiRequest } from './api-requests/get-calls-api-requests';
import { ICallsState } from '../../calls-state';

export class GetCalls {
  static get action() {
    return createAction('GET_CALLS')<IGetCallsActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.calls.loading = false;
    });
  }

  static get saga() {
    return function* getCalls(action: ReturnType<typeof GetCalls.action>): SagaIterator {
      const { page } = action.payload;

      const { httpRequest } = GetCalls;
      const { data, status } = httpRequest.call(
        yield call(() => httpRequest.generator(action.payload)),
      );

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetCallsSuccess.action({ calls: data, hasMore }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ICall[]>, IGetCallsApiRequest>(
      `${process.env.MAIN_API}/api/calls/search`,
      HttpRequestMethod.Post,
    );
  }
}
