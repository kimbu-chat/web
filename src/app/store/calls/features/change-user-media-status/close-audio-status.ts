import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallState } from '../../models';

export class CloseAudioStatus {
  static get action() {
    return createEmptyAction('CLOSE_AUDIO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallState) => {
      draft.audioConstraints.isOpened = false;
      return draft;
    });
  }
}
