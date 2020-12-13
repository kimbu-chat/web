import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { CallState } from '../../models';
import { GetCallsSuccessActionPayload } from './get-calls-success-action-payload';

export class GetCallsSuccess {
  static get action() {
    return createAction('GET_CALLS_SUCCESS')<GetCallsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof GetCallsSuccess.action>) => {
      const { calls, hasMore } = payload;

      draft.calls.calls.push(...calls);
      draft.calls.hasMore = hasMore;
      draft.calls.loading = false;

      return draft;
    });
  }
}
