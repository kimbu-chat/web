import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ICallsState } from '../../models';
import { IGetCallsSuccessActionPayload } from './action-payloads/get-calls-success-action-payload';

export class GetCallsSuccess {
  static get action() {
    return createAction('GET_CALLS_SUCCESS')<IGetCallsSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof GetCallsSuccess.action>) => {
      const { calls, hasMore } = payload;

      draft.calls.calls.push(...calls);
      draft.calls.hasMore = hasMore;
      draft.calls.loading = false;

      return draft;
    });
  }
}
