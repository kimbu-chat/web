import { ICallsState } from '@store/calls/calls-state';
import { createEmptyAction } from '@store/common/actions';
import produce from 'immer';

export class ResetSearchCalls {
  static get action() {
    return createEmptyAction('RESET_SEARCH_CALLS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.searchCallList.callIds = [];
      draft.searchCallList.hasMore = true;
      draft.searchCallList.loading = false;

      return draft;
    });
  }
}
