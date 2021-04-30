import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ICallsState } from '../../calls-state';
import { IGetCallsSuccessActionPayload } from './action-payloads/get-calls-success-action-payload';

export class GetCallsSuccess {
  static get action() {
    return createAction('GET_CALLS_SUCCESS')<IGetCallsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof GetCallsSuccess.action>) => {
      const { calls, hasMore, initializedByScroll, name, callIds } = payload;

      if (initializedByScroll) {
        draft.calls = { ...calls, ...draft.calls };
        if (name?.length) {
          draft.searchCallList.callIds = [
            ...new Set([...draft.searchCallList.callIds, ...callIds]),
          ];
          draft.searchCallList.hasMore = hasMore;
          draft.searchCallList.loading = false;
        } else {
          draft.callList.callIds = [...new Set([...draft.callList.callIds, ...callIds])];
          draft.callList.hasMore = hasMore;
          draft.callList.loading = false;
        }
      } else {
        draft.searchCallList.callIds = callIds;
        draft.searchCallList.hasMore = hasMore;
        draft.searchCallList.loading = false;
      }

      return draft;
    });
  }
}
