import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { RootState } from 'app/store/root-reducer';
import { eventChannel, END, buffers } from 'redux-saga';
import { take, select, call, race, takeEvery } from 'redux-saga/effects';
import { getCallInterlocutorSelector, doIhaveCall } from 'app/store/calls/selectors';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { AcceptCallSuccess } from 'app/store/calls/features/accept-call/accept-call-success';
import { InterlocutorAcceptedCall } from '../features/interlocutor-accepted-call/interlocutor-accepted-call';
import { CandidateApiRequest, RenegociateApiRequest } from '../models';
import { assignInterlocurorVideoTrack, assignInterlocurorAudioTrack, setMakingOffer } from './user-media';

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

  yield takeEvery(channel, function* (action: { type: string; event: RTCTrackEvent | RTCPeerConnectionIceEvent }) {
    console.log('action');
    console.log(action);
    switch (action.type) {
      case 'icecandidate':
        {
          console.log('candidate buffered');
          yield race({
            acceptedByMe: take(InterlocutorAcceptedCall.action),
            acceptedByInterlocutor: take(AcceptCallSuccess.action),
          });

          console.log('candidate sent');

          const { candidate } = action.event as RTCPeerConnectionIceEvent;

          const interlocutor = yield select(getCallInterlocutorSelector);

          if (candidate && interlocutor.id) {
            const request = {
              interlocutorId: interlocutor.id,
              candidate,
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
              offer: peerConnection?.localDescription as RTCSessionDescription,
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
          const { track } = action.event as RTCTrackEvent;

          if (track.kind === 'video') {
            track.onunmute = () => {
              assignInterlocurorVideoTrack(track);
            };
          }

          if (track.kind === 'audio') {
            track.onunmute = () => {
              assignInterlocurorAudioTrack(track);
            };
          }
        }
        break;
      default:
        break;
    }
  });
}
