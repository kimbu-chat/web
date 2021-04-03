import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, delay, put, race, select, spawn, take } from 'redux-saga/effects';
import { createAction, RootState } from 'typesafe-actions';

import { AxiosResponse } from 'axios';
import { httpRequestFactory } from '@store/common/http/http-factory';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { getIsVideoEnabledSelector } from '../../selectors';

import {
  createPeerConnection,
  getPeerConnection,
} from '../../../middlewares/webRTC/peerConnectionFactory';
import { DeclineCall } from '../decline-call/decline-call';
import { ICallsState } from '../../calls-state';
import { deviceUpdateWatcher } from '../../utils/device-update-watcher';
import { getAndSendUserMedia, getMediaDevicesList } from '../../utils/user-media';
import { CancelCall } from '../cancel-call/cancel-call';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';
import { InterlocutorAcceptedCallEventHandler } from '../../socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { TimeoutCall } from '../timeout-call/timeout-call';
import { IOutgoingCallActionPayload } from './action-payloads/outgoing-call-action-payload';
import { InputType } from '../../common/enums/input-type';
import { CallEndedEventHandler } from '../../socket-events/call-ended/call-ended-event-handler';
import { InterlocutorBusy } from '../interlocutor-busy/interlocutor-busy';
import { peerWatcher } from '../../utils/peer-watcher';
import { setIsRenegotiationAccepted } from '../../utils/glare-utils';
import { IOutgoingCallApiRequest } from './api-requests/outgoing-call-api-request';
import { IOutgoingCallApiResponse } from './api-requests/outgoing-call-api-response';

export class OutgoingCall {
  static get action() {
    return createAction('OUTGOING_CALL')<IOutgoingCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof OutgoingCall.action>) => {
      if (draft.isSpeaking) {
        return draft;
      }

      draft.interlocutor = payload.calling;
      draft.isInterlocutorBusy = false;
      draft.amICalling = true;
      draft.audioConstraints = {
        ...draft.audioConstraints,
        isOpened: payload.constraints.audioEnabled,
      };
      draft.videoConstraints = {
        ...draft.videoConstraints,
        isOpened: payload.constraints.videoEnabled,
      };
      return draft;
    });
  }

  static get saga() {
    return function* outgoingCallSaga(
      action: ReturnType<typeof OutgoingCall.action>,
    ): SagaIterator {
      const amISpeaking = yield select((state: RootState) => state.calls.isSpeaking);
      setIsRenegotiationAccepted(false);

      if (amISpeaking) {
        // Prevention of 'double-call'
        return;
      }

      createPeerConnection();
      const peerConnection = getPeerConnection();
      yield spawn(deviceUpdateWatcher);

      const audioOpened = yield select((state: RootState) => state.calls.audioConstraints.isOpened);
      const videoOpened = yield select((state: RootState) => state.calls.videoConstraints.isOpened);

      // gathering data about media devices
      if (audioOpened) {
        const audioDevices: MediaDeviceInfo[] = yield call(
          getMediaDevicesList,
          InputType.AudioInput,
        );

        if (audioDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.AudioInput, devices: audioDevices }));
        }
      }
      if (videoOpened) {
        const videoDevices: MediaDeviceInfo[] = yield call(
          getMediaDevicesList,
          InputType.VideoInput,
        );

        if (videoDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.VideoInput, devices: videoDevices }));
        }
      }

      // setup local stream
      yield call(getAndSendUserMedia);
      //---

      const userInterlocutorId = action.payload.calling.id;

      const offer: RTCSessionDescriptionInit = yield call(async () =>
        peerConnection?.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }),
      );

      yield spawn(peerWatcher);
      yield call(async () => peerConnection?.setLocalDescription(offer));

      const isVideoEnabled = yield select(getIsVideoEnabledSelector);

      const request = {
        offer,
        userInterlocutorId,
        isVideoEnabled,
      };

      const { httpRequest } = OutgoingCall;
      const { isInterlocutorBusy } = httpRequest.call(
        yield call(() => httpRequest.generator(request)),
      ).data;

      if (isInterlocutorBusy) {
        yield put(InterlocutorBusy.action());
        return;
      }

      const { timeout } = yield race({
        canceled: take(CancelCall.action),
        interlocutorCanceled: take(CallEndedEventHandler.action),
        declined: take(DeclineCall.action),
        answered: take(InterlocutorAcceptedCallEventHandler.action),
        timeout: delay(15000),
      });

      if (timeout) {
        yield put(TimeoutCall.action());
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IOutgoingCallApiResponse>, IOutgoingCallApiRequest>(
      `${window.__config.REACT_APP_MAIN_API}/api/calls/send-call-offer`,
      HttpRequestMethod.Post,
    );
  }
}
