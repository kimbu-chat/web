import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ICallsState } from '../../calls-state';

export class OpenAudioStatus {
  static get action() {
    return createAction('OPEN_AUDIO_STATUS')<string | undefined>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof OpenAudioStatus.action>) => {
      draft.audioConstraints.isOpened = true;
      if (payload) {
        draft.audioConstraints.deviceId = payload;
      }
      return draft;
    });
  }
}
