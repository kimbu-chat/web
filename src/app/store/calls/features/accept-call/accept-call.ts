import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http';
import { createPeerConnection, peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select, spawn } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getAudioConstraintsSelector, getCallInterlocutorIdSelector, getIsVideoEnabledSelector, getVideoConstraintsSelector } from 'app/store/calls/selectors';
import { interlocutorOffer } from 'store/middlewares/webRTC/peerConnectionFactory';
import { ICallsState } from '../../models';
import { deviceUpdateWatcher } from '../../utils/device-update-watcher';
import { getAndSendUserMedia, getMediaDevicesList } from '../../utils/user-media';
import { ChangeActiveDeviceId } from '../change-active-device-id/change-active-device-id';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';
import { IAcceptCallActionPayload } from './action-payloads/accept-call-action-payload';
import { InputType } from '../../common/enums/input-type';
import { AcceptCallSuccess } from './accept-call-success';
import { peerWatcher } from '../../utils/peer-watcher';
import { IAcceptCallApiRequest } from './api-requests/accept-call-api-request';

export class AcceptCall {
  static get action() {
    return createAction('ACCEPT_CALL')<IAcceptCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof AcceptCall.action>) => {
      draft.audioConstraints = { ...draft.audioConstraints, isOpened: payload.audioEnabled };
      draft.videoConstraints = { ...draft.videoConstraints, isOpened: payload.videoEnabled };

      return draft;
    });
  }

  static get saga() {
    return function* acceptCallSaga(): SagaIterator {
      createPeerConnection();
      yield spawn(peerWatcher);

      const videoConstraints = yield select(getVideoConstraintsSelector);
      const audioConstraints = yield select(getAudioConstraintsSelector);

      yield spawn(deviceUpdateWatcher);

      // gathering data about media devices
      if (audioConstraints.isOpened) {
        const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.AudioInput);

        if (audioDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.AudioInput, devices: audioDevices }));
          yield put(ChangeActiveDeviceId.action({ kind: InputType.AudioInput, deviceId: audioDevices[0].deviceId }));
        }
      }

      if (videoConstraints.isOpened) {
        const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.VideoInput);

        if (videoDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.VideoInput, devices: videoDevices }));
          yield put(ChangeActiveDeviceId.action({ kind: InputType.VideoInput, deviceId: videoDevices[0].deviceId }));
        }
      }
      //---
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);

      yield call(async () => await peerConnection?.setRemoteDescription(interlocutorOffer as RTCSessionDescriptionInit));

      // setup local stream
      yield call(getAndSendUserMedia);

      const answer = yield call(async () => await peerConnection?.createAnswer());
      yield call(async () => await peerConnection?.setLocalDescription(answer));

      const isVideoEnabled = yield select(getIsVideoEnabledSelector);

      const request = {
        userInterlocutorId: interlocutorId,
        answer,
        isVideoEnabled,
      };

      yield call(() => AcceptCall.httpRequest.generator(request));
      yield put(AcceptCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAcceptCallApiRequest>(`${process.env.MAIN_API}/api/calls/accept-call`, HttpRequestMethod.Post);
  }
}
