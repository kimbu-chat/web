import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select, spawn } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { InputType } from '@store/calls/common/enums/input-type';
import {
  doIhaveCallSelector,
  getAudioConstraintsSelector,
  getCallInterlocutorIdSelector,
  getIsVideoEnabledSelector,
  getVideoConstraintsSelector,
  amICallingSelector,
  getIsAcceptCallPendingSelector,
} from '@store/calls/selectors';
import { deviceUpdateWatcher } from '@store/calls/utils/device-update-watcher';
import { waitForAllICE } from '@store/calls/utils/glare-utils';
import { peerWatcher } from '@store/calls/utils/peer-watcher';
import {
  getAndSendUserMedia,
  getMediaDevicesList,
  stopAllTracks,
} from '@store/calls/utils/user-media';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import {
  createPeerConnection,
  getPeerConnection,
  getInterlocutorOffer,
} from '@store/middlewares/webRTC/peerConnectionFactory';

import { ICallsState } from '../../calls-state';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';

import { AcceptCallSuccess } from './accept-call-success';
import { IAcceptCallActionPayload } from './action-payloads/accept-call-action-payload';
import { IAcceptCallApiRequest } from './api-requests/accept-call-api-request';

export class AcceptCall {
  static get action() {
    return createAction('ACCEPT_CALL')<IAcceptCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof AcceptCall.action>) => {
      draft.audioConstraints = { ...draft.audioConstraints, isOpened: payload.audioEnabled };
      draft.videoConstraints = { ...draft.videoConstraints, isOpened: payload.videoEnabled };

      /* we need to indicate that accept is pending in order determining should we 
      end the call on other instances of accepting accountor not */
      draft.isAcceptPending = true;

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
        const audioDevices: MediaDeviceInfo[] = yield call(
          getMediaDevicesList,
          InputType.AudioInput,
        );

        if (audioDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.AudioInput, devices: audioDevices }));
        }
      }

      if (videoConstraints.isOpened) {
        const videoDevices: MediaDeviceInfo[] = yield call(
          getMediaDevicesList,
          InputType.VideoInput,
        );

        if (videoDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.VideoInput, devices: videoDevices }));
        }
      }
      //---
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);
      const interlocutorOffer = getInterlocutorOffer();
      const peerConnection = getPeerConnection();

      yield call(async () =>
        peerConnection?.setRemoteDescription(interlocutorOffer as RTCSessionDescriptionInit),
      );

      // setup local stream
      yield call(getAndSendUserMedia);

      const callActive = yield select(doIhaveCallSelector);
      const outgoingCallActive = yield select(amICallingSelector);
      const acceptCallPending = yield select(getIsAcceptCallPendingSelector);

      // if canceled call before allowed video then don't send offer
      if (!(callActive || outgoingCallActive || acceptCallPending)) {
        stopAllTracks();
        return;
      }

      const answer = yield call(async () => peerConnection?.createAnswer());
      yield call(async () => peerConnection?.setLocalDescription(answer));

      // when all ICE candidates will becollected them will be sent with the offer
      yield call(waitForAllICE, peerConnection);

      const isVideoEnabled = yield select(getIsVideoEnabledSelector);

      if (peerConnection?.localDescription) {
        const request = {
          userInterlocutorId: interlocutorId,
          answer: peerConnection?.localDescription,
          isVideoEnabled,
        };

        yield call(() => AcceptCall.httpRequest.generator(request));
        yield put(AcceptCallSuccess.action());
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAcceptCallApiRequest>(
      MAIN_API.ACCEPT_CALL,
      HttpRequestMethod.Post,
    );
  }
}
