import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { RootState } from 'app/store/root-reducer';
import { eventChannel, buffers } from 'redux-saga';
import { take, select, call, race, fork, cancel } from 'redux-saga/effects';
import { getCallInterlocutorSelector, amICalled, amICalling } from 'app/store/calls/selectors';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { UserPreview } from 'app/store/my-profile/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { InterlocutorAcceptedCall } from '../features/interlocutor-accepted-call/interlocutor-accepted-call';
import { AcceptCallSuccess } from '../features/accept-call/accept-call-success';
import { CandidateApiRequest, RenegociateApiRequest } from '../models';
import { assignInterlocurorVideoTrack, assignInterlocurorAudioTrack, setMakingOffer } from './user-media';
import { CancelCall } from '../features/cancel-call/cancel-call';
import { DeclineCall } from '../features/decline-call/decline-call';
import { CallEnded } from '../features/end-call/call-ended';

const CallsHttpRequests = {
  candidate: httpRequestFactory<AxiosResponse, CandidateApiRequest>(`${ApiBasePath.MainApi}/api/calls/send-ice-candidate`, HttpRequestMethod.Post),
  renegociate: httpRequestFactory<AxiosResponse, RenegociateApiRequest>(`${ApiBasePath.MainApi}/api/calls/send-renegotiation`, HttpRequestMethod.Post),
};

function createPeerConnectionChannel() {
  return eventChannel<{ type: string; event?: RTCPeerConnectionIceEvent | RTCTrackEvent }>((emit) => {
    const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      emit({ type: 'icecandidate', event });
    };

    const onNegotiationNeeded = () => {
      emit({ type: 'negotiationneeded' });
    };

    const onTrack = (event: RTCTrackEvent) => {
      emit({ type: 'track', event });
    };

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
  console.log('peer watcher spawned');
  const peerChannel = createPeerConnectionChannel();

  const peerWatcherTask = yield fork(function* () {
    while (true) {
      const action: { type: string; event?: RTCPeerConnectionIceEvent | RTCTrackEvent } = yield take(peerChannel);
      switch (action.type) {
        case 'icecandidate': {
          const myCandidate = (action.event as RTCPeerConnectionIceEvent).candidate;
          const interlocutor: UserPreview = yield select(getCallInterlocutorSelector);
          const inclomingCallActive = yield select(amICalled);
          const outgoingCallActive = yield select(amICalling);

          if (inclomingCallActive) {
            yield take(AcceptCallSuccess.action);
          }

          if (outgoingCallActive) {
            yield take(InterlocutorAcceptedCall.action);
          }

          if (myCandidate) {
            console.log('candidate sent');
            const request: CandidateApiRequest = {
              interlocutorId: interlocutor?.id || -1,
              candidate: myCandidate,
            };

            CallsHttpRequests.candidate.call(yield call(() => CallsHttpRequests.candidate.generator(request)));
          }

          break;
        }
        case 'negotiationneeded':
          {
            console.log('negotiationneeded');
            const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);

            setMakingOffer(true);

            const offer = yield call(
              async () =>
                await peerConnection?.createOffer({
                  offerToReceiveAudio: true,
                  offerToReceiveVideo: true,
                }),
            );
            yield call(async () => await peerConnection?.setLocalDescription(offer));
            console.log('local description set');

            const isScreenSharingEnabled = yield select((state: RootState) => state.calls.isScreenSharingOpened);
            const isVideoEnabled = yield select((state: RootState) => state.calls.videoConstraints.isOpened);
            const request: RenegociateApiRequest = {
              offer,
              interlocutorId,
              isVideoEnabled: isVideoEnabled || isScreenSharingEnabled,
            };

            CallsHttpRequests.renegociate.call(yield call(() => CallsHttpRequests.renegociate.generator(request)));
            setMakingOffer(false);
            console.log('reached end of negotiationneeded');
          }
          break;
        case 'track':
          {
            const { track } = action.event as RTCTrackEvent;

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
  });

  yield race({
    callEnded: take(CallEnded.action),
    callCanceled: take(CancelCall.action),
    callDeclined: take(DeclineCall.action),
  });

  yield cancel(peerWatcherTask);

  peerChannel.close();
}
