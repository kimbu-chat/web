import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { amICaling, doIhaveCall } from 'app/store/calls/selectors';
import { InterlocutorAcceptedCallActionPayload } from '../../models';
import { InterlocutorAcceptedCallSuccess } from './interlocutor-accepted-call-success';

export class InterlocutorAcceptedCall {
  static get action() {
    return createAction('INTERLOCUTOR_ACCEPTED_CALL')<InterlocutorAcceptedCallActionPayload>();
  }

  static get saga() {
    return function* callAcceptedSaga(action: ReturnType<typeof InterlocutorAcceptedCall.action>): SagaIterator {
      const myId = yield select(getMyIdSelector);
      const doICall = yield select(amICaling);
      const isCallActive = yield select(doIhaveCall);

      if (action.payload.interlocutorId !== myId && (doICall || isCallActive)) {
        const remoteDesc = new RTCSessionDescription(action.payload.answer);
        yield call(async () => await peerConnection?.setRemoteDescription(remoteDesc));

        yield put(InterlocutorAcceptedCallSuccess.action({ ...action.payload, myId }));
      }
    };
  }
}
