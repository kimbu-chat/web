import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getCallInterlocutorIdSelector } from '../../selectors';
import { CandidateActionPayload } from './candidate-action-payload';

export class Candidate {
  static get action() {
    return createAction('CANDIDATE')<CandidateActionPayload>();
  }

  static get saga() {
    return function* candidateSaga(action: ReturnType<typeof Candidate.action>): SagaIterator {
      const interlocutorId = yield select(getCallInterlocutorIdSelector);

      if (action.payload.userInterlocutorId === interlocutorId) {
        yield call(async () => await peerConnection?.addIceCandidate(new RTCIceCandidate(action.payload.candidate)));
      }
    };
  }
}
