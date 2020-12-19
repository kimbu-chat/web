import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { createPeerConnection, peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select, spawn } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getVideoConstraints, getAudioConstraints, getCallInterlocutorIdSelector, getOffer, getIsVideoEnabled } from 'app/store/calls/selectors';
import { AcceptCallApiRequest, CallState } from '../../models';
import { deviceUpdateWatcher } from '../../utils/device-update-watcher';
import { peerWatcher } from '../../utils/peer-watcher';
import { getAndSendUserMedia, getMediaDevicesList } from '../../utils/user-media';
import { ChangeActiveDeviceId } from '../change-active-device-id/change-active-device-id';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';
import { AcceptCallActionPayload } from './accept-call-action-payload';
import { InputType } from '../../common/enums/input-type';

export class AcceptCall {
  static get action() {
    return createAction('ACCEPT_CALL')<AcceptCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof AcceptCall.action>) => {
      draft.audioConstraints = { ...draft.audioConstraints, isOpened: payload.audioEnabled };
      draft.videoConstraints = { ...draft.videoConstraints, isOpened: payload.videoEnabled };

      draft.isSpeaking = true;
      draft.amICalled = false;
      draft.amICaling = false;

      return draft;
    });
  }

  static get saga() {
    return function* acceptCallSaga(): SagaIterator {
      const videoConstraints = yield select(getVideoConstraints);
      const audioConstraints = yield select(getAudioConstraints);

      createPeerConnection();
      yield spawn(peerWatcher);
      yield spawn(deviceUpdateWatcher);

      // setup local stream

      yield call(getAndSendUserMedia);

      // gathering data about media devices
      if (audioConstraints.isOpened) {
        const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.audioInput);

        if (audioDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.audioInput, devices: audioDevices }));
          yield put(ChangeActiveDeviceId.action({ kind: InputType.audioInput, deviceId: audioDevices[0].deviceId }));
        }
      }

      if (videoConstraints.isOpened) {
        const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.videoInput);

        if (videoDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.videoInput, devices: videoDevices }));
          yield put(ChangeActiveDeviceId.action({ kind: InputType.videoInput, deviceId: videoDevices[0].deviceId }));
        }
      }
      //---

      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);
      const offer: RTCSessionDescriptionInit = yield select(getOffer);

      //! CHECK: peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
      peerConnection?.setRemoteDescription(offer);
      const answer = yield call(async () => await peerConnection?.createAnswer());
      yield call(async () => await peerConnection?.setLocalDescription(answer));

      const isVideoEnabled = yield select(getIsVideoEnabled);

      const request = {
        interlocutorId,
        answer,
        isVideoEnabled,
      };

      AcceptCall.httpRequest.call(yield call(() => AcceptCall.httpRequest.generator(request)));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, AcceptCallApiRequest>(`${ApiBasePath.MainApi}/api/calls/accept-call`, HttpRequestMethod.Post);
  }
}
