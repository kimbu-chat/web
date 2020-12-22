import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { amICalled, doIhaveCall, getCallInterlocutorIdSelector } from '../../selectors';
import { ignoreOffer } from '../../utils/user-media';
import { CandidateActionPayload } from './candidate-action-payload';

export class Candidate {
  static get action() {
    return createAction('CANDIDATE')<CandidateActionPayload>();
  }

  static get saga() {
    return function* candidateSaga(action: ReturnType<typeof Candidate.action>): SagaIterator {
      const incomingCallActive = yield select(amICalled);
      const isCallActive = yield select(doIhaveCall);
      const interlocutorId = yield select(getCallInterlocutorIdSelector);

      try {
        if (incomingCallActive || (isCallActive && action.payload.userInterlocutorId === interlocutorId)) {
          console.log('added');
          yield call(async () => await peerConnection?.addIceCandidate(action.payload.candidate));
        }
      } catch (err) {
        if (!ignoreOffer) {
          throw err;
        } // Suppress ignored offer's candidates
      }
    };
  }
}
