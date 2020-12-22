import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { doIhaveCall, getCallInterlocutorIdSelector } from '../../selectors';
import { ignoreOffer } from '../../utils/user-media';
import { CandidateActionPayload } from './candidate-action-payload';

export class Candidate {
  static get action() {
    return createAction('CANDIDATE')<CandidateActionPayload>();
  }

  static get saga() {
    return function* candidateSaga(action: ReturnType<typeof Candidate.action>): SagaIterator {
      const interlocutorId = yield select(getCallInterlocutorIdSelector);
      const isCallActive = yield select(doIhaveCall);

      try {
        if (action.payload.userInterlocutorId === interlocutorId && isCallActive) {
          console.log('added');
          yield call(async () => await peerConnection?.addIceCandidate(new RTCIceCandidate(action.payload.candidate)));
        }
      } catch (err) {
        if (!ignoreOffer) {
          throw err;
        } // Suppress ignored offer's candidates
      }
    };
  }
}
