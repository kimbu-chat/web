import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getCallInterlocutorIdSelector, getIsActiveCallIncoming, getIsScreenSharingEnabled, getVideoConstraints } from '../../selectors';
import { AcceptCallApiRequest } from '../../models';

import { ignoreOffer, isSettingRemoteAnswerPending, makingOffer, setIgnoreOffer } from '../../utils/glare-utils';
import { RenegotiationActionPayload } from './renegotiation-action-payload';

export class Renegotiation {
  static get action() {
    return createAction('RENEGOTIATION')<RenegotiationActionPayload>();
  }

  static get saga() {
    return function* negociationSaga(action: ReturnType<typeof Renegotiation.action>): SagaIterator {
      const polite = yield select(getIsActiveCallIncoming);
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);
      const readyForOffer = !makingOffer && (peerConnection?.signalingState === 'stable' || isSettingRemoteAnswerPending);
      const offerCollision = !readyForOffer;

      setIgnoreOffer(!polite && offerCollision);
      if (ignoreOffer) {
        console.log('oofeerr IGNORED');
        return;
      }

      if (interlocutorId === action.payload.userInterlocutorId) {
        const videoConstraints = yield select(getVideoConstraints);
        const isScreenSharingEnabled = yield select(getIsScreenSharingEnabled);

        yield call(async () => await peerConnection?.setRemoteDescription(action.payload.offer));

        const answer = yield call(async () => await peerConnection?.createAnswer());
        yield call(async () => await peerConnection?.setLocalDescription(answer));

        const request = {
          userInterlocutorId: interlocutorId,
          answer,
          isVideoEnabled: videoConstraints.isOpened || isScreenSharingEnabled,
        };

        Renegotiation.httpRequest.call(yield call(() => Renegotiation.httpRequest.generator(request)));
      } else {
        console.log('paralel');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(`${ApiBasePath.MainApi}/api/calls/accept-renegotiation`, HttpRequestMethod.Post);
  }
}
