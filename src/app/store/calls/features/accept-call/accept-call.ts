import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { createPeerConnection, peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { ApiBasePath } from 'app/store/root-api';
import { RootState } from 'app/store/root-reducer';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select, spawn } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { AcceptCallApiRequest, AcceptIncomingCallActionPayload, CallState } from '../../models';
import { deviceUpdateWatcher } from '../../utils/device-update-watcher';
import { peerWatcher } from '../../utils/peer-watcher';
import { getAndSendUserMedia, getMediaDevicesList } from '../../utils/user-media';
import { AcceptCallSuccess } from './accept-call-success';
import { ChangeActiveDeviceId } from '../change-active-device-id/change-active-device-id';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';

export class AcceptCall {
  static get action() {
    return createAction('ACCEPT_CALL')<AcceptIncomingCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof AcceptCall.action>) => {
      draft.audioConstraints = { ...draft.audioConstraints, isOpened: payload.constraints.audioEnabled };
      draft.videoConstraints = { ...draft.videoConstraints, isOpened: payload.constraints.videoEnabled };
      return draft;
    });
  }

  static get saga() {
    return function* acceptCallSaga(action: ReturnType<typeof AcceptCall.action>): SagaIterator {
      const videoConstraints = yield select((state: RootState) => state.calls.videoConstraints);
      const audioConstraints = yield select((state: RootState) => state.calls.audioConstraints);
      const isVideoError = false;

      createPeerConnection();
      yield spawn(peerWatcher);
      yield spawn(deviceUpdateWatcher);

      // setup local stream

      yield call(getAndSendUserMedia);

      // gathering data about media devices
      if (audioConstraints.isOpened) {
        const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'audioinput');
        yield put(GotDevicesInfo.action({ kind: 'audioinput', devices: audioDevices }));
        yield put(ChangeActiveDeviceId.action({ kind: 'audioinput', deviceId: audioDevices[0].deviceId }));
      }
      if (videoConstraints.isOpened) {
        const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, 'videoinput');
        yield put(GotDevicesInfo.action({ kind: 'videoinput', devices: videoDevices }));

        if (videoDevices[0]) {
          yield put(ChangeActiveDeviceId.action({ kind: 'videoinput', deviceId: videoDevices[0].deviceId }));
        }
      }
      //---

      const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);
      const offer: RTCSessionDescriptionInit = yield select((state: RootState) => state.calls.offer);

      peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = yield call(async () => await peerConnection?.createAnswer());
      yield call(async () => await peerConnection?.setLocalDescription(answer));

      const request = {
        interlocutorId,
        answer,
        isVideoEnabled: videoConstraints.isOpened && !isVideoError,
      };

      AcceptCall.httpRequest.call(yield call(() => AcceptCall.httpRequest.generator(request)));

      yield put(AcceptCallSuccess.action(action.payload));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/accept-call`, HttpRequestMethod.Post);
  }
}
