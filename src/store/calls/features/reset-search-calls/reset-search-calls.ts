import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '@store/calls/calls-state';

export class ResetSearchCalls {
  static get action() {
    return createAction('RESET_SEARCH_CALLS');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.searchCallList.callIds = [];
      draft.searchCallList.hasMore = true;
      draft.searchCallList.loading = false;

      return draft;
    };
  }
}
