import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { ICallsState } from '../../models';

export class OpenAudioStatus {
  static get action() {
    return createEmptyAction('OPEN_AUDIO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.audioConstraints.isOpened = true;
      return draft;
    });
  }
}
