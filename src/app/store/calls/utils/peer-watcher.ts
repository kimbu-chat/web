import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { RootState } from 'app/store/root-reducer';
import { eventChannel, buffers } from 'redux-saga';
import { take, select, call, race, cancel, takeEvery, put } from 'redux-saga/effects';
import { getCallInterlocutorSelector, amICalled, amICalling } from 'app/store/calls/selectors';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { UserPreview } from 'app/store/my-profile/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { OpenInterlocutorVideoStatus } from '../features/change-interlocutor-media-status/open-interlocutor-video-status';
import { InterlocutorAcceptedCall } from '../features/interlocutor-accepted-call/interlocutor-accepted-call';
import { AcceptCallSuccess } from '../features/accept-call/accept-call-success';
import { CandidateApiRequest, RenegociateApiRequest } from '../models';
import { assignInterlocutorVideoTrack, assignInterlocutorAudioTrack, interlocutorVideoTrack } from './user-media';
import { CancelCall } from '../features/cancel-call/cancel-call';
import { DeclineCall } from '../features/decline-call/decline-call';
import { CallEnded } from '../features/end-call/call-ended';
import { CloseInterlocutorVideoStatus } from '../features/change-interlocutor-media-status/close-interlocutor-video-status';
import { setMakingOffer } from './glare-utils';

const CallsHttpRequests = {
  candidate: httpRequestFactory<AxiosResponse, CandidateApiRequest>(`${ApiBasePath.MainApi}/api/calls/send-ice-candidate`, HttpRequestMethod.Post),
  renegotiate: httpRequestFactory<AxiosResponse, RenegociateApiRequest>(`${ApiBasePath.MainApi}/api/calls/send-renegotiation`, HttpRequestMethod.Post),
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
      if (event.track.kind === 'video') {
        console.log('videoTrackReceived');
        event.track.onunmute = () => {
          console.log('videoTrackUnmuted');
          emit({ type: 'videoTrackUnmuted', event });
        };

        event.track.onmute = () => {
          console.log('videoTrackMuted');
          emit({ type: 'videoTrackMuted' });
        };
      }

      if (event.track.kind === 'audio') {
        emit({ type: 'audioTrack', event });
        console.log('audioTrack');
      }
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

  const peerWatcherTask = yield takeEvery(peerChannel, function* (action: { type: string; event?: RTCPeerConnectionIceEvent | RTCTrackEvent }) {
    switch (action.type) {
      case 'icecandidate': {
        const myCandidate = (action.event as RTCPeerConnectionIceEvent).candidate;
        const interlocutor: UserPreview = yield select(getCallInterlocutorSelector);
        const inclomingCallActive = yield select(amICalled);
        const outgoingCallActive = yield select(amICalling);

        if (inclomingCallActive) {
          // console.log('inclomingCallActive');
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

          const request: RenegociateApiRequest = {
            offer,
            interlocutorId,
            isVideoEnabled: false,
          };

          CallsHttpRequests.renegotiate.call(yield call(() => CallsHttpRequests.renegotiate.generator(request)));
          setMakingOffer(false);

          console.log('reached end of negotiationneeded', peerConnection);
        }
        break;
      case 'audioTrack':
        {
          const { track } = action.event as RTCTrackEvent;

          assignInterlocutorAudioTrack(track);
        }
        break;
      case 'videoTrackUnmuted':
        {
          const { track } = action.event as RTCTrackEvent;

          if (!interlocutorVideoTrack) {
            assignInterlocutorVideoTrack(track);
          }

          yield put(OpenInterlocutorVideoStatus.action());
        }
        break;
      case 'videoTrackMuted':
        yield put(CloseInterlocutorVideoStatus.action());
        break;
      default:
        break;
    }
  });

  yield race({
    callEnded: take(CallEnded.action),
    callCanceled: take(CancelCall.action),
    callDeclined: take(DeclineCall.action),
  });

  console.log('CANCEL-CANCEL-CANCEL-CANCEL-CANCEL');

  yield cancel(peerWatcherTask);

  peerChannel.close();
}
