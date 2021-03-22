import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getPeerConnection } from '../../../middlewares/webRTC/peerConnectionFactory';
import { getCallInterlocutorIdSelector } from '../../selectors';
import { getIgnoreOffer } from '../../utils/glare-utils';
import { IIceCandidateSentIntegrationEvent } from './ice-candidate-sent-integration-event';

export class IceCandidateSentEventHandler {
  static get action() {
    return createAction('IceCandidateSent')<IIceCandidateSentIntegrationEvent>();
  }

  static get saga() {
    return function* candidateSaga(action: ReturnType<typeof IceCandidateSentEventHandler.action>): SagaIterator {
      const interlocutorId = yield select(getCallInterlocutorIdSelector);
      const peerConnection = getPeerConnection();
      const ignoreOffer = getIgnoreOffer();

      if (action.payload.userInterlocutorId === interlocutorId) {
        try {
          yield call(async () => peerConnection?.addIceCandidate(new RTCIceCandidate(action.payload.candidate)));
        } catch (err) {
          if (!ignoreOffer) {
            throw err;
          } // Suppress ignored offer's candidates
        }
      }
    };
  }
}
