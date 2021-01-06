import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getCallInterlocutorIdSelector } from '../../selectors';
import { ignoreOffer } from '../../utils/glare-utils';
import { IIceCandidateSentIntegrationEvent } from './ice-candidate-sent-integration-event';

export class IceCandidateSentEventHandler {
  static get action() {
    return createAction('IceCandidateSent')<IIceCandidateSentIntegrationEvent>();
  }

  static get saga() {
    return function* candidateSaga(action: ReturnType<typeof IceCandidateSentEventHandler.action>): SagaIterator {
      const interlocutorId = yield select(getCallInterlocutorIdSelector);

      if (action.payload.userInterlocutorId === interlocutorId) {
        try {
          yield call(async () => await peerConnection?.addIceCandidate(new RTCIceCandidate(action.payload.candidate)));
        } catch (err) {
          if (!ignoreOffer) {
            throw err;
          } // Suppress ignored offer's candidates
        }
      }
    };
  }
}
