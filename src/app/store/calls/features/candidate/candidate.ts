import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { CandidateActionPayload } from '../../models';

export class Candidate {
  static get action() {
    return createAction('CANDIDATE')<CandidateActionPayload>();
  }

  static get saga() {
    return function* candidateSaga(action: ReturnType<typeof Candidate.action>): SagaIterator {
      peerConnection?.addIceCandidate(new RTCIceCandidate(action.payload.candidate));
    };
  }
}
