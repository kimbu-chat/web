import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { UserPreview } from 'app/store/my-profile/models';
import { ApiBasePath } from 'app/store/root-api';
import { RootState } from 'app/store/root-reducer';
import { AxiosResponse } from 'axios';
import { eventChannel, END, buffers } from 'redux-saga';
import { take, select, call } from 'redux-saga/effects';
import { CandidateApiRequest, CallApiRequest } from '../models';

const CallsHttpRequests = {
  candidate: httpRequestFactory<AxiosResponse, CandidateApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/candidate`, HttpRequestMethod.Post),
  call: httpRequestFactory<AxiosResponse, CallApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/call`, HttpRequestMethod.Post),
};

function createPeerConnectionChannel() {
  return eventChannel((emit) => {
    const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      emit({ type: 'icecandidate', event });
    };

    const onNegotiationNeeded = () => {
      emit({ type: 'negotiationneeded' });
    };

    const onConnectionStateChange = () => {
      if (peerConnection?.connectionState === 'connected') {
        console.log('connected');
      }
    };

    const clearIntervalCode = setInterval(() => {
      const state = peerConnection?.connectionState;
      if (!state || state === 'closed' || state === 'disconnected') {
        clearInterval(clearIntervalCode);
        emit(END);
      }
    }, 1000);

    peerConnection?.addEventListener('icecandidate', onIceCandidate);
    peerConnection?.addEventListener('negotiationneeded', onNegotiationNeeded);
    peerConnection?.addEventListener('connectionstatechange', onConnectionStateChange);

    return () => {
      peerConnection?.removeEventListener('icecandidate', onIceCandidate);
      peerConnection?.removeEventListener('negotiationneeded', onNegotiationNeeded);
      peerConnection?.removeEventListener('connectionstatechange', onConnectionStateChange);
    };
  }, buffers.expanding(100));
}

export function* peerWatcher() {
  const channel = createPeerConnectionChannel();
  while (true) {
    const action = yield take(channel);

    switch (action.type) {
      case 'icecandidate':
        {
          const interlocutor = yield select((state: RootState): UserPreview | undefined => state.calls.interlocutor);

          if (action.event.candidate) {
            const request = {
              interlocutorId: interlocutor?.id || -1,
              candidate: action.event.candidate,
            };
            const httpRequest = CallsHttpRequests.candidate;
            httpRequest.call(yield call(() => httpRequest.generator(request)));
          }
        }
        break;
      case 'negotiationneeded':
        {
          console.log('negociateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
          const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
          const myProfile: UserPreview = yield select((state: RootState): UserPreview | undefined => state.myProfile.user);
          const isCallActive: boolean = yield select((state: RootState): boolean => state.calls.isSpeaking);
          const isVideoEnabled = yield select((state: RootState) => state.calls.videoConstraints.isOpened);
          const isScreenSharingEnabled = yield select((state: RootState) => state.calls.isScreenSharingOpened);

          if (isCallActive) {
            const offer = yield call(
              async () =>
                await peerConnection?.createOffer({
                  offerToReceiveAudio: true,
                  offerToReceiveVideo: true,
                }),
            );
            yield call(async () => await peerConnection?.setLocalDescription(offer));

            const request = {
              offer,
              isRenegociation: true,
              interlocutorId,
              caller: myProfile,
              isVideoEnabled: isVideoEnabled || isScreenSharingEnabled,
            };

            const httpRequest = CallsHttpRequests.call;
            httpRequest.call(yield call(() => httpRequest.generator(request)));
          }
        }
        break;
      default:
        break;
    }
  }
}
