import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
import { ICallsState } from '../../calls-state';

export class CloseAudioStatus {
  static get action() {
    return createEmptyAction('CLOSE_AUDIO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.audioConstraints.isOpened = false;
      return draft;
    });
  }
}
