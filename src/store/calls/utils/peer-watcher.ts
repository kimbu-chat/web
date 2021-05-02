import { buffers, eventChannel, SagaIterator } from 'redux-saga';
import { call, cancel, put, race, select, take, takeEvery } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { MAIN_API } from '@common/paths';
import {
  amICalledSelector,
  getCallInterlocutorIdSelector,
  getIsVideoEnabledSelector,
} from '../selectors';
import { httpRequestFactory, HttpRequestMethod } from '../../common/http';

import { getPeerConnection } from '../../middlewares/webRTC/peerConnectionFactory';
import { RenegotiationAcceptedEventHandler } from '../socket-events/renegotiation-accepted/renegotiation-accepted-event-handler';
import { OpenInterlocutorVideoStatus } from '../features/change-interlocutor-media-status/open-interlocutor-video-status';
import { InterlocutorAcceptedCallEventHandler } from '../socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { AcceptCallSuccess } from '../features/accept-call/accept-call-success';
import { assignInterlocutorAudioTrack, assignInterlocutorVideoTrack } from './user-media';
import { CancelCall } from '../features/cancel-call/cancel-call';
import { DeclineCall } from '../features/decline-call/decline-call';
import { CallEndedEventHandler } from '../socket-events/call-ended/call-ended-event-handler';
import {
  getIsRenegotiationAccepted,
  setIsRenegotiationAccepted,
  setMakingOffer,
} from './glare-utils';
import { ICandidateApiRequest } from './api-requests/candidate-api-request';
import { IRenegociateApiRequest } from './api-requests/renegotiate-api-request';
import { OpenInterlocutorAudioStatus } from '../features/change-interlocutor-media-status/open-interlocutor-audio-status';

const CallsHttpRequests = {
  candidate: httpRequestFactory<AxiosResponse, ICandidateApiRequest>(
    MAIN_API.SEND_ICE_CANDIDATE,
    HttpRequestMethod.Post,
  ),
  renegotiate: httpRequestFactory<AxiosResponse, IRenegociateApiRequest>(
    MAIN_API.SEND_RENEGOTIATION,
    HttpRequestMethod.Post,
  ),
};

function createPeerConnectionChannel() {
  return eventChannel<{ type: string; event?: RTCPeerConnectionIceEvent | RTCTrackEvent }>(
    (emit) => {
      const peerConnection = getPeerConnection();
      const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
        emit({ type: 'icecandidate', event });
      };

      const onNegotiationNeeded = () => {
        emit({ type: 'negotiationneeded' });
      };

      const onTrack = (event: RTCTrackEvent) => {
        if (event.track.kind === 'video') {
          // eslint-disable-next-line no-param-reassign
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
    },
    buffers.expanding(100),
  );
}

export function* peerWatcher(): SagaIterator {
  const peerChannel = createPeerConnectionChannel();

  const peerWatcherTask = yield takeEvery(
    peerChannel,
    function* peerWatcherTask(action: {
      type: string;
      event?: RTCPeerConnectionIceEvent | RTCTrackEvent;
    }): SagaIterator {
      const peerConnection = getPeerConnection();
      const isRenegotiationAccepted = getIsRenegotiationAccepted();

      switch (action.type) {
        case 'icecandidate': {
          const myCandidate = (action.event as RTCPeerConnectionIceEvent).candidate;
          const interlocutorId = yield select(getCallInterlocutorIdSelector);
          const inclomingCallActive = yield select(amICalledSelector);

          if (inclomingCallActive) {
            yield take(AcceptCallSuccess.action);
          }

          if (!isRenegotiationAccepted) {
            yield race([
              take(RenegotiationAcceptedEventHandler.action),
              take(InterlocutorAcceptedCallEventHandler.action),
            ]);
          }

          if (myCandidate) {
            const request: ICandidateApiRequest = {
              interlocutorId,
              candidate: myCandidate,
            };

            yield call(() => CallsHttpRequests.candidate.generator(request));
          }

          break;
        }
        case 'negotiationneeded':
          {
            setIsRenegotiationAccepted(false);

            const interlocutorId = yield select(getCallInterlocutorIdSelector);

            setMakingOffer(true);
            const offer = yield call(async () =>
              peerConnection?.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
              }),
            );

            yield call(async () => peerConnection?.setLocalDescription(offer));

            const isVideoEnabled = yield select(getIsVideoEnabledSelector);

            const request: IRenegociateApiRequest = {
              offer,
              interlocutorId,
              isVideoEnabled,
            };

            yield call(() => CallsHttpRequests.renegotiate.generator(request));
            setMakingOffer(false);
          }
          break;
        case 'audioTrack':
          {
            const { track } = action.event as RTCTrackEvent;

            assignInterlocutorAudioTrack(track);

            yield put(OpenInterlocutorAudioStatus.action());
          }
          break;
        case 'videoTrackUnmuted':
          {
            const { track } = action.event as RTCTrackEvent;

            assignInterlocutorVideoTrack(track);

            yield put(OpenInterlocutorVideoStatus.action());
          }
          break;
        default:
          break;
      }
    },
  );

  yield race({
    callEnded: take(CallEndedEventHandler.action),
    callCanceled: take(CancelCall.action),
    callDeclined: take(DeclineCall.action),
  });

  yield cancel(peerWatcherTask);

  peerChannel.close();
}
