import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { doIhaveCallSelector, getIsActiveCallIncomingSelector } from '../../selectors';
import { getPeerConnection } from '../../../middlewares/webRTC/peerConnectionFactory';
import {
  getIsSettingRemoteAnswerPending,
  getMakingOffer,
  setIgnoreOffer,
  setIsRenegotiationAccepted,
  setIsSettingRemoteAnswerPending,
} from '../../utils/glare-utils';

import { IRenegotiationAcceptedIntegrationEvent } from './renegotiation-accepted-integration-event';

export class RenegotiationAcceptedEventHandler {
  static get action() {
    return createAction('RenegotiationAccepted')<IRenegotiationAcceptedIntegrationEvent>();
  }

  static get saga() {
    return function* renegotiationAcceptedSaga(
      action: ReturnType<typeof RenegotiationAcceptedEventHandler.action>,
    ): SagaIterator {
      const callActive = yield select(doIhaveCallSelector);
      const peerConnection = getPeerConnection();
      const isSettingRemoteAnswerPending = getIsSettingRemoteAnswerPending();
      const makingOffer = getMakingOffer();

      if (action.payload.answer && callActive) {
        setIsRenegotiationAccepted(true);
        const polite = yield select(getIsActiveCallIncomingSelector);
        const readyForOffer =
          !makingOffer &&
          (peerConnection?.signalingState === 'stable' || isSettingRemoteAnswerPending);
        const offerCollision = !readyForOffer;

        setIgnoreOffer(!polite && offerCollision);

        setIsSettingRemoteAnswerPending(true);
        yield call(async () => peerConnection?.setRemoteDescription(action.payload.answer));
        setIsSettingRemoteAnswerPending(false);
      }
    };
  }
}
