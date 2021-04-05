import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
import { ICallsState } from '../../calls-state';

export class OpenInterlocutorAudioStatus {
  static get action() {
    return createEmptyAction('OPEN_INTERLOCUTOR_AUDIO_STATUS');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      draft.isInterlocutorAudioEnabled = true;
      return draft;
    });
  }
}
