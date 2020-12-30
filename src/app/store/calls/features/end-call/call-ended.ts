import { createEmptyAction } from 'app/store/common/actions';
import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { ICallState } from '../../models';

export class CallEnded {
  static get action() {
    return createEmptyAction('CALL_ENDED');
  }

  static get reducer() {
    return produce((draft: ICallState) => {
      draft.interlocutor = undefined;
      draft.isInterlocutorBusy = false;
      draft.amICalling = false;
      draft.amICalled = false;
      draft.isSpeaking = false;
      draft.isInterlocutorVideoEnabled = false;
      draft.videoConstraints.isOpened = false;
      draft.videoConstraints.isOpened = false;
      draft.isScreenSharingOpened = false;
      return draft;
    });
  }

  static get saga() {
    return function* (): SagaIterator {
      resetPeerConnection();
    };
  }
}
