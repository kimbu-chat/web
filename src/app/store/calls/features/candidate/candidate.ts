import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { ignoreOffer } from '../../utils/user-media';
import { CandidateActionPayload } from './candidate-action-payload';

export class Candidate {
  static get action() {
    return createAction('CANDIDATE')<CandidateActionPayload>();
  }

  static get saga() {
    return function* candidateSaga(action: ReturnType<typeof Candidate.action>): SagaIterator {
      try {
        console.log('candidate');
        yield call(async () => await peerConnection?.addIceCandidate(new RTCIceCandidate(action.payload.candidate)));
      } catch (err) {
        console.log('catcheeedEEE');
        if (!ignoreOffer) {
          throw err;
        } // Suppress ignored offer's candidates
      }
    };
  }
}
