import { AxiosResponse } from 'axios';
import produce from 'immer';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { ById } from '@store/chats/models/by-id';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { IUser } from '@store/common/models';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { ICallsState } from '../../calls-state';
import { ICall, INormalizedCall } from '../../common/models';
import { callArrNormalizationSchema } from '../../normalization';

import { IGetCallsActionPayload } from './action-payloads/get-calls-action-payload';
import { IGetCallsApiRequest } from './api-requests/get-calls-api-requests';
import { GetCallsSuccess } from './get-calls-success';

export class GetCalls {
  static get action() {
    return createAction('GET_CALLS')<IGetCallsActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof GetCalls.action>) => {
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
    });
  }

  static get saga() {
    return function* getCalls(action: ReturnType<typeof GetCalls.action>): SagaIterator {
      const { page, name, initializedByScroll } = action.payload;

      if (!name?.length && !initializedByScroll) {
        return;
      }

      const { httpRequest } = GetCalls;
      const { data, status } = httpRequest.call(
        yield call(() => httpRequest.generator(action.payload)),
      );

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        const {
          entities: { calls, users },
          result,
        } = normalize<ICall[], { calls: ById<INormalizedCall>; users: ById<IUser> }, number[]>(
          data,
          callArrNormalizationSchema,
        );

        yield put(
          GetCallsSuccess.action({ callIds: result, calls, hasMore, name, initializedByScroll }),
        );

        yield put(AddOrUpdateUsers.action({ users }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ICall[]>, IGetCallsApiRequest>(
      MAIN_API.GET_CALLS,
      HttpRequestMethod.Post,
    );
  }
}
