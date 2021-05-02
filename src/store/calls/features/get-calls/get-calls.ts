import { normalize } from 'normalizr';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { IUser } from '@store/common/models';
import { UpdateUsersList } from '@store/users/features/update-users-list/update-users-list';
import { callArrNormalizationSchema } from '../../normalization';
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
        } = normalize<ICall[], { calls: ICall[]; users: IUser[] }, number[]>(
          data,
          callArrNormalizationSchema,
        );

        yield put(
          GetCallsSuccess.action({ callIds: result, calls, hasMore, name, initializedByScroll }),
        );

        yield put(UpdateUsersList.action({ users }));
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
