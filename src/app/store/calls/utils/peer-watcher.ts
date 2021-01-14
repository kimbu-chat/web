import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { RootState } from 'app/store/root-reducer';
import { buffers, eventChannel } from 'redux-saga';
import { call, cancel, put, race, select, take, takeEvery } from 'redux-saga/effects';
import { amICalledSelector, getCallInterlocutorSelector, getIsVideoEnabledSelector } from 'app/store/calls/selectors';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod, IUserPreview } from 'app/store/models';

import { AxiosResponse } from 'axios';
import { RenegotiationAcceptedEventHandler } from '../socket-events/renegotiation-accepted/renegotiation-accepted-event-handler';
import { OpenInterlocutorVideoStatus } from '../features/change-interlocutor-media-status/open-interlocutor-video-status';
import { InterlocutorAcceptedCallEventHandler } from '../socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { AcceptCallSuccess } from '../features/accept-call/accept-call-success';
import { assignInterlocutorAudioTrack, assignInterlocutorVideoTrack } from './user-media';
import { CancelCall } from '../features/cancel-call/cancel-call';
import { DeclineCall } from '../features/decline-call/decline-call';
import { CallEndedEventHandler } from '../socket-events/call-ended/call-ended-event-handler';
import { CloseInterlocutorVideoStatus } from '../features/change-interlocutor-media-status/close-interlocutor-video-status';
import { isRenegotiationAccepted, setIsRenegotiationAccepted, setMakingOffer } from './glare-utils';
import { ICandidateApiRequest } from './api-requests/candidate-api-request';
import { IRenegociateApiRequest } from './api-requests/renegotiate-api-request';

const CallsHttpRequests = {
  candidate: httpRequestFactory<AxiosResponse, ICandidateApiRequest>(`${process.env.MAIN_API}/api/calls/send-ice-candidate`, HttpRequestMethod.Post),
  renegotiate: httpRequestFactory<AxiosResponse, IRenegociateApiRequest>(`${process.env.MAIN_API}/api/calls/send-renegotiation`, HttpRequestMethod.Post),
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
        event.track.onunmute = () => {
          emit({ type: 'videoTrackUnmuted', event });
        };
      }

      if (event.track.kind === 'audio') {
        emit({ type: 'audioTrack', event });
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
  const peerChannel = createPeerConnectionChannel();

  const peerWatcherTask = yield takeEvery(peerChannel, function* (action: { type: string; event?: RTCPeerConnectionIceEvent | RTCTrackEvent }) {
    switch (action.type) {
      case 'icecandidate': {
        const myCandidate = (action.event as RTCPeerConnectionIceEvent).candidate;
        const interlocutor: IUserPreview = yield select(getCallInterlocutorSelector);
        const inclomingCallActive = yield select(amICalledSelector);

        if (inclomingCallActive) {
          yield take(AcceptCallSuccess.action);
        }

        if (!isRenegotiationAccepted) {
          yield race([take(RenegotiationAcceptedEventHandler.action), take(InterlocutorAcceptedCallEventHandler.action)]);
        }

        if (myCandidate) {
          const request: ICandidateApiRequest = {
            interlocutorId: interlocutor?.id || -1,
            candidate: myCandidate,
          };

          CallsHttpRequests.candidate.call(yield call(() => CallsHttpRequests.candidate.generator(request)));
        }

        break;
      }
      case 'negotiationneeded':
        {
          setIsRenegotiationAccepted(false);

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

          const isVideoEnabled = yield select(getIsVideoEnabledSelector);

          const request: IRenegociateApiRequest = {
            offer,
            interlocutorId,
            isVideoEnabled,
          };

          CallsHttpRequests.renegotiate.call(yield call(() => CallsHttpRequests.renegotiate.generator(request)));
          setMakingOffer(false);
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

          assignInterlocutorVideoTrack(track);

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
    callEnded: take(CallEndedEventHandler.action),
    callCanceled: take(CancelCall.action),
    callDeclined: take(DeclineCall.action),
  });

  yield cancel(peerWatcherTask);

  peerChannel.close();
}
