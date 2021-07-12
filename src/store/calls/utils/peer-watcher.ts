import { AxiosResponse } from 'axios';
import { buffers, eventChannel, SagaIterator } from 'redux-saga';
import { call, cancel, put, race, select, take, takeEvery } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';

import { httpRequestFactory, HttpRequestMethod } from '../../common/http';
import { getPeerConnection } from '../../middlewares/webRTC/peerConnectionFactory';
import { CancelCall } from '../features/cancel-call/cancel-call';
import { OpenInterlocutorAudioStatus } from '../features/change-interlocutor-media-status/open-interlocutor-audio-status';
import { OpenInterlocutorVideoStatus } from '../features/change-interlocutor-media-status/open-interlocutor-video-status';
import { DeclineCall } from '../features/decline-call/decline-call';
import { EndCall } from '../features/end-call/end-call';
import { getCallInterlocutorIdSelector, getIsVideoEnabledSelector } from '../selectors';
import { CallEndedEventHandler } from '../socket-events/call-ended/call-ended-event-handler';

import { IRenegociateApiRequest } from './api-requests/renegotiate-api-request';
import { setIsRenegotiationAccepted, setMakingOffer } from './glare-utils';
import { assignInterlocutorAudioTrack, assignInterlocutorVideoTrack } from './user-media';

const CallsHttpRequests = {
  renegotiate: httpRequestFactory<AxiosResponse, IRenegociateApiRequest>(
    MAIN_API.SEND_RENEGOTIATION,
    HttpRequestMethod.Post,
  ),
};

function createPeerConnectionChannel() {
  return eventChannel<{ type: string; event?: RTCPeerConnectionIceEvent | RTCTrackEvent }>(
    (emit) => {
      const peerConnection = getPeerConnection();

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

      const onConnectionStateChange = () => {
        emit({ type: 'connectionstatechange' });
      };

      peerConnection?.addEventListener('negotiationneeded', onNegotiationNeeded);
      peerConnection?.addEventListener('track', onTrack);
      peerConnection?.addEventListener('connectionstatechange', onConnectionStateChange);

      return () => {
        peerConnection?.removeEventListener('negotiationneeded', onNegotiationNeeded);
        peerConnection?.removeEventListener('track', onTrack);
        peerConnection?.removeEventListener('connectionstatechange', onConnectionStateChange);
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
      switch (action.type) {
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

            // yield call(waitForAllICE, peerConnection);

            const isVideoEnabled = yield select(getIsVideoEnabledSelector);
            if (peerConnection?.localDescription) {
              const request: IRenegociateApiRequest = {
                offer: peerConnection.localDescription,
                interlocutorId,
                isVideoEnabled,
              };

              yield call(() => CallsHttpRequests.renegotiate.generator(request));
              setMakingOffer(false);
            }
          }
          break;
        case 'audioTrack':
          {
            const { track } = action.event as RTCTrackEvent;

            assignInterlocutorAudioTrack(track);

            yield put(OpenInterlocutorAudioStatus.action());
          }
          break;
        // here we need to listen for this event in order to prevent 'the play request was ....' error;
        case 'videoTrackUnmuted':
          {
            const { track } = action.event as RTCTrackEvent;

            assignInterlocutorVideoTrack(track);

            yield put(OpenInterlocutorVideoStatus.action());
          }
          break;
        case 'connectionstatechange':
          if (peerConnection?.connectionState === 'disconnected') {
            yield put(EndCall.action());
          }
          break;
        default:
          break;
      }
    },
  );

  // we wait for first event that will end call and then we kill watcher instance
  yield race({
    callEnded: take(CallEndedEventHandler.action),
    callCanceled: take(CancelCall.action),
    callDeclined: take(DeclineCall.action),
  });

  yield cancel(peerWatcherTask);

  peerChannel.close();
}
