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

      draft.calls.loading = false;
      draft.calls.hasMore = hasMore;

      if (initializedByScroll) {
        if (name?.length) {
          draft.calls.searchCalls = unionBy(draft.calls.searchCalls, calls, 'id');
        } else {
          draft.calls.calls = unionBy(draft.calls.calls, calls, 'id');
        }
      } else {
        draft.calls.searchCalls = calls;
      }

      return draft;
    });
  }
}
