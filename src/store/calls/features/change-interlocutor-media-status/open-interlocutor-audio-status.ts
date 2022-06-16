import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class OpenInterlocutorAudioStatus {
  static get action() {
    return createAction('OPEN_INTERLOCUTOR_AUDIO_STATUS');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.isInterlocutorAudioEnabled = true;
      return draft;
    };
  }
}
