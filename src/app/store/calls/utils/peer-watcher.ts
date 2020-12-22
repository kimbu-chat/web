import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { RootState } from 'app/store/root-reducer';
import { eventChannel, END, buffers } from 'redux-saga';
import { take, select, call } from 'redux-saga/effects';
import { getCallInterlocutorSelector, doIhaveCall } from 'app/store/calls/selectors';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { CandidateApiRequest, RenegociateApiRequest } from '../models';
import { assignInterlocurorVideoTrack, assignInterlocurorAudioTrack, setMakingOffer } from './user-media';
import { InterlocutorAcceptedCall } from '../features/interlocutor-accepted-call/interlocutor-accepted-call';

const CallsHttpRequests = {
  candidate: httpRequestFactory<AxiosResponse, CandidateApiRequest>(`${ApiBasePath.MainApi}/api/calls/send-ice-candidate`, HttpRequestMethod.Post),
  renegociate: httpRequestFactory<AxiosResponse, RenegociateApiRequest>(`${ApiBasePath.MainApi}/api/calls/send-renegotiation`, HttpRequestMethod.Post),
};

function createPeerConnectionChannel() {
  return eventChannel((emit) => {
    const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      emit({ type: 'icecandidate', event });
    };

    const onNegotiationNeeded = () => {
      emit({ type: 'negotiationneeded' });
    };

    const onTrack = (event: RTCTrackEvent) => {
      emit({ type: 'track', event });
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
    peerConnection?.addEventListener('track', onTrack);

    return () => {
      peerConnection?.removeEventListener('icecandidate', onIceCandidate);
      peerConnection?.removeEventListener('negotiationneeded', onNegotiationNeeded);
      peerConnection?.removeEventListener('track', onTrack);
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
          yield take(InterlocutorAcceptedCall.action);
          const interlocutor = yield select(getCallInterlocutorSelector);

          if (action.event.candidate) {
            const request = {
              interlocutorId: interlocutor?.id || -1,
              candidate: action.event.candidate,
            };
            CallsHttpRequests.candidate.call(yield call(() => CallsHttpRequests.candidate.generator(request)));
          }
        }
        break;
      case 'negotiationneeded':
        {
          const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
          const isCallActive: boolean = yield select(doIhaveCall);
          const isVideoEnabled = yield select((state: RootState) => state.calls.videoConstraints.isOpened);
          const isScreenSharingEnabled = yield select((state: RootState) => state.calls.isScreenSharingOpened);

          if (isCallActive) {
            setMakingOffer(true);
            const offer = yield call(
              async () =>
                await peerConnection?.createOffer({
                  offerToReceiveAudio: true,
                  offerToReceiveVideo: true,
                }),
            );
            yield call(async () => await peerConnection?.setLocalDescription(offer));

            const request: RenegociateApiRequest = {
              offer,
              interlocutorId,
              isVideoEnabled: isVideoEnabled || isScreenSharingEnabled,
            };

            CallsHttpRequests.renegociate.call(yield call(() => CallsHttpRequests.renegociate.generator(request)));
            setMakingOffer(false);
          }
        }
        break;
      case 'track':
        {
          const { track } = action.event;

          if (track.kind === 'video') {
            assignInterlocurorVideoTrack(track);
            console.log('video track received');
          }

          if (track.kind === 'audio') {
            assignInterlocurorAudioTrack(track);
            console.log('audio track received');
          }
        }
        break;
      default:
        break;
    }
  }
}
