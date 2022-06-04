import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class CloseAudioStatus {
  static get action() {
    return createAction('CLOSE_AUDIO_STATUS');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.audioConstraints.isOpened = false;
      return draft;
    };
  }
}
