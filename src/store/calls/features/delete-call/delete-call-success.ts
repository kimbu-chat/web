import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export interface IDeleteCallSuccessActionPayload {
  id: number;
}

export class DeleteCallSuccess {
  static get action() {
    return createAction<IDeleteCallSuccessActionPayload>('DELETE_CALL_SUCCESS');
  }

  static get reducer() {
    return (draft: ICallsState, { payload }: ReturnType<typeof DeleteCallSuccess.action>) => {
      const { id: idToDelete } = payload;
      const { callList, calls } = draft;

      callList.callIds = callList.callIds.filter((callId) => callId !== idToDelete);
      delete calls[idToDelete];

      return draft;
    };
  }
}
