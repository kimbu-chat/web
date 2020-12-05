import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { createPeerConnection, peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { UserPreview } from 'app/store/my-profile/models';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import { ApiBasePath } from 'app/store/root-api';
import { RootState } from 'app/store/root-reducer';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, delay, put, race, select, spawn, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { OutgoingCallActionPayload, CallState, CallApiRequest } from '../../models';
import { deviceUpdateWatcher } from '../../utils/device-update-watcher';
import { peerWatcher } from '../../utils/peer-watcher';
import { getAndSendUserMedia, getMediaDevicesList } from '../../utils/user-media';
import { CancelCall } from '../cancel-call/cancel-call';
import { ChangeActiveDeviceId } from '../change-active-device-id/change-active-device-id';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';
import { InterlocutorAcceptedCall } from '../interlocutor-accepted-call/interlocutor-accepted-call';
import { InterlocutorCanceledCall } from '../interlocutor-canceled-call/interlocutor-canceled-call';
import { TimeoutCall } from '../timeout-call/timeout-call';

export class OutgoingCall {
  static get action() {
    return createAction('OUTGOING_CALL')<OutgoingCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof OutgoingCall.action>) => {
      const interlocutor = payload.calling;
      draft.interlocutor = interlocutor;
      draft.isInterlocutorBusy = false;
      draft.amICaling = true;
      draft.isActiveCallIncoming = false;
      draft.audioConstraints = { ...draft.audioConstraints, isOpened: payload.constraints.audioEnabled };
      draft.videoConstraints = { ...draft.videoConstraints, isOpened: payload.constraints.videoEnabled };
      return draft;
    });
  }

  static get saga() {
    return function* outgoingCallSaga(action: ReturnType<typeof OutgoingCall.action>): SagaIterator {
      const amISpeaking = yield select((state: RootState) => state.calls.isSpeaking);
      const isVideoError = false;

      if (amISpeaking) {
        // Prevention of 'double-call'
        return;
      }

      createPeerConnection();
      yield spawn(peerWatcher);
      yield spawn(deviceUpdateWatcher);

      // setup local stream
      yield call(getAndSendUserMedia);
      //---

      const audioOpened = yield select((state: RootState) => state.calls.audioConstraints.isOpened);
      const videoOpened = yield select((state: RootState) => state.calls.videoConstraints.isOpened);

      // gathering data about media devices
      if (audioOpened) {
        const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
        yield put(GotDevicesInfo.action({ kind: 'audioinput', devices: audioDevices }));
        yield put(ChangeActiveDeviceId.action({ kind: 'audioinput', deviceId: audioDevices[0].deviceId }));
      }
      if (videoOpened) {
        const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
        yield put(GotDevicesInfo.action({ kind: 'videoinput', devices: videoDevices }));
        yield put(ChangeActiveDeviceId.action({ kind: 'videoinput', deviceId: videoDevices[0].deviceId }));
      }

      const interlocutorId = action.payload.calling.id;
      const myProfile: UserPreview = yield select(getMyProfileSelector);
      const offer: RTCSessionDescriptionInit = yield call(
        async () => await peerConnection?.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }),
      );
      yield call(async () => await peerConnection?.setLocalDescription(offer));

      const request = {
        offer,
        interlocutorId,
        caller: myProfile,
        isVideoEnabled: action.payload.constraints.videoEnabled && !isVideoError,
      };

      OutgoingCall.httpRequest.call(yield call(() => OutgoingCall.httpRequest.generator(request)));

      const { timeout } = yield race({
        canceled: take(CancelCall.action),
        interlocutorCanceled: take(InterlocutorCanceledCall.action),
        answered: take(InterlocutorAcceptedCall.action),
        timeout: delay(15000),
      });

      if (timeout) {
        yield put(TimeoutCall.action());
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, CallApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/call`, HttpRequestMethod.Post);
  }
}
