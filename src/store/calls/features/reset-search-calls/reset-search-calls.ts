import { ICallsState } from '@store/calls/calls-state';
import { createEmptyAction } from '@store/common/actions';
import produce from 'immer';

export class ResetSearchCalls {
  static get action() {
    return createEmptyAction('RESET_SEARCH_CALLS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.searchCalls.calls = [];
      draft.searchCalls.hasMore = true;
      draft.searchCalls.loading = false;

      return draft;
    });
  }
}
