import { RootState } from 'app/store/root-reducer';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { CancelCallSuccess } from './cancel-call-success';
import { InterlocutorAcceptCallActionPayload } from '../models';
import { InterlocutorAcceptedCallSuccess } from './interlocutor-accepted-call-success';

export class InterlocutorAcceptedCall {
  static get action() {
    return createAction('INTERLOCUTOR_ACCEPTED_CALL')<InterlocutorAcceptCallActionPayload>();
  }

  static get saga() {
    return function* callAcceptedSaga(action: ReturnType<typeof InterlocutorAcceptedCall.action>): SagaIterator {
      const isSpeaking = yield select((state: RootState) => state.calls.isSpeaking);
      const amICaling = yield select((state: RootState) => state.calls.amICaling);
      const amICalled = yield select((state: RootState) => state.calls.amICalled);

      if (amICaling || (isSpeaking && action.payload.isRenegotiation)) {
        console.log('setRemoteDescriptionsetRemoteDescription');
        try {
          const remoteDesc = new RTCSessionDescription(action.payload.answer);
          yield call(async () => await peerConnection?.setRemoteDescription(remoteDesc));
        } catch (e) {
          console.log(e);
        }

        console.log('accepted');
        yield put(InterlocutorAcceptedCallSuccess.action(action.payload));
      } else if (amICalled) {
        console.log('paralel');
        yield put(CancelCallSuccess.action());
      }
    };
  }
}
