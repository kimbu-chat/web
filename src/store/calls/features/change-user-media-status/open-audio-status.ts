import { createAction } from '@reduxjs/toolkit';

import { ICallsState } from '../../calls-state';

export class OpenAudioStatus {
  static get action() {
    return createAction<string | undefined>('OPEN_AUDIO_STATUS');
  }

  static get reducer() {
    return (draft: ICallsState, { payload }: ReturnType<typeof OpenAudioStatus.action>) => {
      draft.audioConstraints.isOpened = true;
      if (payload) {
        draft.audioConstraints.deviceId = payload;
      }
      return draft;
    };
  }
}
