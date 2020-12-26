import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, spawn } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { peerWatcher } from '../../utils/peer-watcher';
import { CallState, InterlocutorAcceptedCallActionPayload } from '../../models';

export class InterlocutorAcceptedCall {
  static get action() {
    return createAction('INTERLOCUTOR_ACCEPTED_CALL')<InterlocutorAcceptedCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof InterlocutorAcceptedCall.action>) => {
      draft.isSpeaking = true;
      draft.amICalled = false;
      draft.amICaling = false;

      draft.isActiveCallIncoming = false;
      draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;
      return draft;
    });
  }

  static get saga() {
    return function* callAcceptedSaga(action: ReturnType<typeof InterlocutorAcceptedCall.action>): SagaIterator {
      if (action.payload.answer) {
        yield call(async () => await peerConnection?.setRemoteDescription(action.payload.answer));
        yield spawn(peerWatcher);
      }
    };
  }
}
