import { DeclineCall } from 'app/store/calls/features/decline-call/decline-call';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { createPeerConnection, peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, delay, put, race, select, spawn, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { RootState } from 'app/store/root-reducer';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { getIsVideoEnabled } from 'app/store/calls/selectors';
import { CallState, CallApiRequest, CallApiResponse } from '../../models';
import { deviceUpdateWatcher } from '../../utils/device-update-watcher';
import { getAndSendUserMedia, getMediaDevicesList } from '../../utils/user-media';
import { CancelCall } from '../cancel-call/cancel-call';
import { ChangeActiveDeviceId } from '../change-active-device-id/change-active-device-id';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';
import { InterlocutorAcceptedCall } from '../interlocutor-accepted-call/interlocutor-accepted-call';
import { TimeoutCall } from '../timeout-call/timeout-call';
import { OutgoingCallActionPayload } from './outgoing-call-action-payload';
import { InputType } from '../../common/enums/input-type';
import { CallEnded } from '../end-call/call-ended';
import { InterlocutorBusy } from '../interlocutor-busy/interlocutor-busy';

export class OutgoingCall {
  static get action() {
    return createAction('OUTGOING_CALL')<OutgoingCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof OutgoingCall.action>) => {
      if (draft.isSpeaking) {
        return draft;
      }

      draft.interlocutor = payload.calling;
      draft.isInterlocutorBusy = false;
      draft.amICaling = true;
      draft.audioConstraints = { ...draft.audioConstraints, isOpened: payload.constraints.audioEnabled };
      draft.videoConstraints = { ...draft.videoConstraints, isOpened: payload.constraints.videoEnabled };
      return draft;
    });
  }

  static get saga() {
    return function* outgoingCallSaga(action: ReturnType<typeof OutgoingCall.action>): SagaIterator {
      const amISpeaking = yield select((state: RootState) => state.calls.isSpeaking);

      if (amISpeaking) {
        // Prevention of 'double-call'
        return;
      }

      createPeerConnection();
      yield spawn(deviceUpdateWatcher);

      // setup local stream
      yield call(getAndSendUserMedia);
      //---

      const audioOpened = yield select((state: RootState) => state.calls.audioConstraints.isOpened);
      const videoOpened = yield select((state: RootState) => state.calls.videoConstraints.isOpened);

      // gathering data about media devices
      if (audioOpened) {
        const audioDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.audioInput);

        if (audioDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.audioInput, devices: audioDevices }));
          yield put(ChangeActiveDeviceId.action({ kind: InputType.audioInput, deviceId: audioDevices[0].deviceId }));
        }
      }
      if (videoOpened) {
        const videoDevices: MediaDeviceInfo[] = yield call(getMediaDevicesList, InputType.videoInput);

        if (videoDevices.length > 0) {
          yield put(GotDevicesInfo.action({ kind: InputType.videoInput, devices: videoDevices }));
          yield put(ChangeActiveDeviceId.action({ kind: InputType.videoInput, deviceId: videoDevices[0].deviceId }));
        }
      }

      const userInterlocutorId = action.payload.calling.id;

      const offer: RTCSessionDescriptionInit = yield call(
        async () => await peerConnection?.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }),
      );

      yield call(async () => await peerConnection?.setLocalDescription(offer));

      const isVideoEnabled = yield select(getIsVideoEnabled);

      const request = {
        offer,
        userInterlocutorId,
        isVideoEnabled,
      };

      const { isInterlocutorBusy } = OutgoingCall.httpRequest.call(yield call(() => OutgoingCall.httpRequest.generator(request))).data;

      if (isInterlocutorBusy) {
        yield put(InterlocutorBusy.action());
        return;
      }

      const { timeout } = yield race({
        canceled: take(CancelCall.action),
        interlocutorCanceled: take(CallEnded.action),
        declined: take(DeclineCall.action),
        answered: take(InterlocutorAcceptedCall.action),
        timeout: delay(15000),
      });

      if (timeout) {
        yield put(TimeoutCall.action());
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<CallApiResponse>, CallApiRequest>(`${ApiBasePath.MainApi}/api/calls/send-call-offer`, HttpRequestMethod.Post);
  }
}
