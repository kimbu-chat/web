import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { getCallInterlocutorIdSelector, getIsActiveCallIncoming, getIsScreenSharingEnabled, getVideoConstraints } from 'app/store/calls/selectors';
import { CallState, AcceptCallApiRequest } from '../../models';
import { IncomingCallActionPayload } from './incoming-call-action-payload';
import { makingOffer, isSettingRemoteAnswerPending, ignoreOffer, setIgnoreOffer, setIsSettingRemoteAnswerPending } from '../../utils/user-media';

setInterval(() => console.log(peerConnection?.connectionState), 1000);

export class IncomingCall {
  static get action() {
    return createAction('INCOMING_CALL')<IncomingCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof IncomingCall.action>) => {
      draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;

      if (draft.isSpeaking) {
        // if it matches this condition then it's negociation
        return draft;
      }

      const interlocutor = payload.caller;
      const { offer } = payload;
      draft.interlocutor = interlocutor;
      draft.amICalled = true;
      draft.isActiveCallIncoming = true;
      draft.offer = offer;

      return draft;
    });
  }

  static get saga() {
    return function* negociationSaga(action: ReturnType<typeof IncomingCall.action>): SagaIterator {
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);

      console.log(
        '\n isRenegotiation:',
        action.payload.isRenegotiation,
        '\n interlocutorId:',
        interlocutorId,
        '\n action.payload.caller.id:',
        action.payload.caller.id,
      );

      if (action.payload.isRenegotiation && interlocutorId === action.payload.caller.id) {
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
        peerConnection?.setRemoteDescription(new RTCSessionDescription(action.payload.offer));
        setIsSettingRemoteAnswerPending(false);

        const answer = yield call(async () => await peerConnection?.createAnswer());
        yield call(async () => await peerConnection?.setLocalDescription(answer));

        const request = {
          interlocutorId,
          answer,
          isVideoEnabled: videoConstraints.isOpened || isScreenSharingEnabled,
        };

        IncomingCall.httpRequest.call(yield call(() => IncomingCall.httpRequest.generator(request)));
      } else {
        console.log('paralel');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/accept-call`, HttpRequestMethod.Post);
  }
}
