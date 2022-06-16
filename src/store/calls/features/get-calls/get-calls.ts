import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { ICall, IGetCallsRequest, IPaginationParams, IUser } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { INormalizedCall } from '@store/calls/common/models';
import { getCallsListSelector, getSearchCallsListSelector } from '@store/calls/selectors';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { CALL_LIMIT } from '../../../../utils/pagination-limits';
import { ICallsState } from '../../calls-state';
import { callArrNormalizationSchema } from '../../normalization';

import { IGetCallsActionPayload } from './action-payloads/get-calls-action-payload';
import { GetCallsSuccess } from './get-calls-success';

export class GetCalls {
  static get action() {
    return createAction<IGetCallsActionPayload>('GET_CALLS');
  }

  static get reducer() {
    return (draft: ICallsState, { payload }: ReturnType<typeof GetCalls.action>) => {
      if (!payload.name?.length && !payload.initializedByScroll) {
        draft.searchCallList.callIds = [];
        draft.searchCallList.hasMore = true;
        draft.searchCallList.loading = false;
      }

      if (payload.name?.length) {
        draft.searchCallList.loading = true;
      } else if (payload.initializedByScroll) {
        draft.callList.loading = true;
      }

      return draft;
    };
  }

  static get saga() {
    return function* getCalls(action: ReturnType<typeof GetCalls.action>): SagaIterator {
      const { name, initializedByScroll } = action.payload;

      if (!name?.length && !initializedByScroll) {
        return;
      }
      const callList = yield select(getCallsListSelector);
      const searchCallList = yield select(getSearchCallsListSelector);

      const page: IPaginationParams = {
        offset: action.payload.name?.length
          ? searchCallList.callIds.length
          : callList.callIds.length,
        limit: CALL_LIMIT,
      };

      const request: IGetCallsRequest = { name, page };

      const { httpRequest } = GetCalls;
      const { data, status } = httpRequest.call(yield call(() => httpRequest.generator(request)));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        const {
          entities: { calls, users },
          result,
        } = normalize<
          ICall[],
          { calls: Record<number, INormalizedCall>; users: Record<number, IUser> },
          number[]
        >(data, callArrNormalizationSchema);

        yield put(
          GetCallsSuccess.action({ callIds: result, calls, hasMore, name, initializedByScroll }),
        );

        yield put(AddOrUpdateUsers.action({ users }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ICall[]>, IGetCallsRequest>(
      MAIN_API.GET_CALLS,
      HttpRequestMethod.Post,
    );
  }
}
