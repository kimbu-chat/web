import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { GetCallsResponse, CallState } from '../models';

export class GetCallsSuccess {
  static get action() {
    return createAction('GET_CALLS_SUCCESS')<GetCallsResponse>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof GetCallsSuccess.action>) => {
      const { calls, hasMore } = payload;

      draft.calls.push(...calls);
      draft.hasMore = hasMore;

      return draft;
    });
  }
}
