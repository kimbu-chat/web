import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { AcceptCallApiRequest, CallState } from '../../models';
import { getCallInterlocutorIdSelector, getIsActiveCallIncoming, getVideoConstraints, getIsScreenSharingEnabled } from '../../selectors';
import { makingOffer, isSettingRemoteAnswerPending, setIgnoreOffer, ignoreOffer, setIsSettingRemoteAnswerPending } from '../../utils/user-media';
import { RenegotiationActionPayload } from './renegotiation-action-payload';

export class Renegotiation {
  static get action() {
    return createAction('RENEGOTIATION')<RenegotiationActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof Renegotiation.action>) => {
      if (draft.interlocutor?.id === payload.userInterlocutorId) {
        draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;
      }

      return draft;
    });
  }

  static get saga() {
    return function* negociationSaga(action: ReturnType<typeof Renegotiation.action>): SagaIterator {
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);

      if (interlocutorId === action.payload.userInterlocutorId) {
        const polite = !(yield select(getIsActiveCallIncoming));
        const readyForOffer = !makingOffer && (peerConnection?.signalingState === 'stable' || isSettingRemoteAnswerPending);
        const offerCollision = !readyForOffer;

        setIgnoreOffer(!polite && offerCollision);
        if (ignoreOffer) {
          return;
        }

        const videoConstraints = yield select(getVideoConstraints);
        const isScreenSharingEnabled = yield select(getIsScreenSharingEnabled);

        setIsSettingRemoteAnswerPending(true);
        yield call(async () => await peerConnection?.setRemoteDescription(new RTCSessionDescription(action.payload.offer)));
        setIsSettingRemoteAnswerPending(false);

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
    return httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(`${ApiBasePath.MainApi}/api/calls/accept-call`, HttpRequestMethod.Post);
  }
}
