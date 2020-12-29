import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { doIhaveCall } from 'app/store/calls/selectors';
import { setIgnoreOffer, setIsRenegotiationAccepted, setIsSettingRemoteAnswerPending } from '../../utils/glare-utils';
import { RenegotiationAcceptedActionPayload } from './renegotiation-accepted-action-payload';

export class RenegotiationAccepted {
  static get action() {
    return createAction('RENEGOTIATION_ACCEPTED')<RenegotiationAcceptedActionPayload>();
  }

  static get saga() {
    return function* renegotiationAcceptedSaga(action: ReturnType<typeof RenegotiationAccepted.action>): SagaIterator {
      const callActive = yield select(doIhaveCall);

      if (action.payload.answer && callActive) {
        setIsRenegotiationAccepted(true);
        setIgnoreOffer(false);

        setIsSettingRemoteAnswerPending(false);
        yield call(async () => await peerConnection?.setRemoteDescription(action.payload.answer));
        setIsSettingRemoteAnswerPending(true);
      }
    };
  }
}
