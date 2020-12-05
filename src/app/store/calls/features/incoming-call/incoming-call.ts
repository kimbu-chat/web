import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { RootState } from 'app/store/root-reducer';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { IncomingCallActionPayload, CallState, AcceptCallApiRequest } from '../../models';

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
      const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
      const isCallActive: boolean = yield select((state: RootState): boolean => state.calls.isSpeaking);

      if (isCallActive && interlocutorId === action.payload.caller.id) {
        const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
        const isScreenSharingEnabled = yield select((state: RootState) => state.calls.isScreenSharingOpened);

        peerConnection?.setRemoteDescription(new RTCSessionDescription(action.payload.offer));
        const answer = yield call(async () => await peerConnection?.createAnswer());
        yield call(async () => await peerConnection?.setLocalDescription(answer));

        const request = {
          interlocutorId,
          answer,
          isVideoEnabled: videoConstraints.isOpened || isScreenSharingEnabled,
        };

        IncomingCall.httpRequest.acceptCall.call(yield call(() => IncomingCall.httpRequest.acceptCall.generator(request)));
      } else if (isCallActive) {
        const interlocutorId: number = action.payload.caller.id;

        const request = {
          interlocutorId,
        };

        IncomingCall.httpRequest.busyCall.call(yield call(() => IncomingCall.httpRequest.busyCall.generator(request)));
      }
    };
  }

  static get httpRequest() {
    return {
      busyCall: httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/call-busy`, HttpRequestMethod.Post),
      acceptCall: httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/accept-call`, HttpRequestMethod.Post),
    };
  }
}
