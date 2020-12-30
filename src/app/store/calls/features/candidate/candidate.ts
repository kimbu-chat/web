import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getCallInterlocutorIdSelector } from '../../selectors';
import { ignoreOffer } from '../../utils/glare-utils';
import { ICandidateActionPayload } from './candidate-action-payload';

export class Candidate {
  static get action() {
    return createAction('CANDIDATE')<ICandidateActionPayload>();
  }

  static get saga() {
    return function* candidateSaga(action: ReturnType<typeof Candidate.action>): SagaIterator {
      const interlocutorId = yield select(getCallInterlocutorIdSelector);

      if (action.payload.userInterlocutorId === interlocutorId) {
        try {
          yield call(async () => await peerConnection?.addIceCandidate(new RTCIceCandidate(action.payload.candidate)));
        } catch (err) {
          if (!ignoreOffer) {
            console.log('offer is ignored and candidate error is catched');
            throw err;
          } // Suppress ignored offer's candidates
        }
      }
    };
  }
}
