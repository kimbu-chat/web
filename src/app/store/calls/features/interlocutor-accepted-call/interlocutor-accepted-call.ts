import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { doIhaveCall, amICaling, amICalled } from 'app/store/calls/selectors';
import { CancelCallSuccess } from '../cancel-call/cancel-call-success';
import { InterlocutorAcceptedCallSuccess } from './interlocutor-accepted-call-success';
import { InterlocutorAcceptedCallActionPayload } from './interlocutor-accepted-call-action-payload';

export class InterlocutorAcceptedCall {
  static get action() {
    return createAction('INTERLOCUTOR_ACCEPTED_CALL')<InterlocutorAcceptedCallActionPayload>();
  }

  static get saga() {
    return function* callAcceptedSaga(action: ReturnType<typeof InterlocutorAcceptedCall.action>): SagaIterator {
      const isSpeaking = yield select(doIhaveCall);
      const doICallSomebody = yield select(amICaling);
      const doSomebodyCallMe = yield select(amICalled);

      if (doICallSomebody || (isSpeaking && action.payload.isRenegotiation)) {
        console.log('setRemoteDescriptionsetRemoteDescription');
        try {
          const remoteDesc = new RTCSessionDescription(action.payload.answer);
          yield call(async () => await peerConnection?.setRemoteDescription(remoteDesc));
        } catch (e) {
          console.log(e);
        }

        console.log('accepted');
        yield put(InterlocutorAcceptedCallSuccess.action(action.payload));
      } else if (doSomebodyCallMe) {
        console.log('paralel');
        yield put(CancelCallSuccess.action());
      }
    };
  }
}
