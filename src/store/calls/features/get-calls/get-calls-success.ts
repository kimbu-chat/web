import produce from 'immer';
import { unionBy } from 'lodash';
import { createAction } from 'typesafe-actions';
import { ICallsState } from '../../calls-state';
import { IGetCallsSuccessActionPayload } from './action-payloads/get-calls-success-action-payload';

export class GetCallsSuccess {
  static get action() {
    return createAction('GET_CALLS_SUCCESS')<IGetCallsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof GetCallsSuccess.action>) => {
      const { calls, hasMore, initializedByScroll, name } = payload;

      if (initializedByScroll) {
        if (name?.length) {
          draft.searchCalls.calls = unionBy(draft.searchCalls.calls, calls, 'id');
          draft.searchCalls.hasMore = hasMore;
          draft.searchCalls.loading = false;
        } else {
          draft.calls.calls = unionBy(draft.calls.calls, calls, 'id');
          draft.calls.hasMore = hasMore;
          draft.calls.loading = false;
        }
      } else {
        draft.searchCalls.calls = calls;
        draft.searchCalls.hasMore = hasMore;
        draft.searchCalls.loading = false;
      }

      return draft;
    });
  }
}
