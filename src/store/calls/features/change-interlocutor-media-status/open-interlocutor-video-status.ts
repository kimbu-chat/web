import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class OpenInterlocutorVideoStatus {
  static get action() {
    return createAction('OPEN_INTERLOCUTOR_VIDEO_STATUS');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.isInterlocutorVideoEnabled = true;
      return draft;
    };
  }
}
