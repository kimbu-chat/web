import { peerConnection, resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { InterlocutorCanceledCallIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/interlocutor-canceled-call-integration-event';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getCallInterlocutorIdSelector } from 'app/store/calls/selectors';
import { CallState } from '../../models';
import { stopAllTracks, videoSender, setVideoSender } from '../../utils/user-media';

export class InterlocutorCanceledCall {
  static get action() {
    return createAction('INTERLOCUTOR_CANCELED_CALL')<InterlocutorCanceledCallIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof InterlocutorCanceledCall.action>) => {
      if (draft.interlocutor?.id === payload.interlocutorId) {
        draft.interlocutor = undefined;
        draft.amICaling = false;
        draft.amICalled = false;
        draft.isSpeaking = false;
        draft.offer = undefined;
        draft.answer = undefined;
        draft.videoConstraints.isOpened = false;
        draft.videoConstraints.isOpened = false;
        draft.isInterlocutorVideoEnabled = false;
        draft.isScreenSharingOpened = false;
      }
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof InterlocutorCanceledCall.action>): SagaIterator {
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);

      if (interlocutorId === action.payload.interlocutorId) {
        peerConnection?.close();
        resetPeerConnection();

        stopAllTracks();

        if (videoSender) {
          try {
            peerConnection?.removeTrack(videoSender);
          } catch (e) {
            console.warn(e);
          }
          setVideoSender(null);
        }
      }
    };
  }
}
