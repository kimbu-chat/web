import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
import { ICallsState } from '../../calls-state';

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