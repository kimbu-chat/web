import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { ICallsState } from '../../models';
import { ICallEndedIntegrationEvent } from './call-ended-integration-event';

export class CallEndedEventHandler {
  static get action() {
    return createAction('CallEnded')<ICallEndedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
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
