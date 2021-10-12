import { AxiosResponse } from 'axios';
import produce from 'immer';
import { ISendCallOfferResponse, ISendCallOfferRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, delay, put, race, select, spawn, take } from 'redux-saga/effects';
import { createAction, RootState } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory } from '@store/common/http/http-factory';
import { HttpRequestMethod } from '@store/common/http/http-request-method';

import {
  createPeerConnection,
  getPeerConnection,
} from '../../../middlewares/webRTC/peerConnectionFactory';
import { ICallsState } from '../../calls-state';
import { InputType } from '../../common/enums/input-type';
import { getIsVideoEnabledSelector } from '../../selectors';
import { CallEndedEventHandler } from '../../socket-events/call-ended/call-ended-event-handler';
import { InterlocutorAcceptedCallEventHandler } from '../../socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { deviceUpdateWatcher } from '../../utils/device-update-watcher';
import { setIsRenegotiationAccepted, waitForAllICE } from '../../utils/glare-utils';
import { peerWatcher } from '../../utils/peer-watcher';
import {
  getAndSendUserMedia,
  getMediaDevicesList,
  preventEternalCamera,
} from '../../utils/user-media';
import { CancelCall } from '../cancel-call/cancel-call';
import { DeclineCall } from '../decline-call/decline-call';
import { GotDevicesInfo } from '../got-devices-info/got-devices-info';
import { InterlocutorBusy } from '../interlocutor-busy/interlocutor-busy';
import { TimeoutCall } from '../timeout-call/timeout-call';

import { IOutgoingCallActionPayload } from './action-payloads/outgoing-call-action-payload';

export class OutgoingCall {
  static get action() {
    return createAction('OUTGOING_CALL')<IOutgoingCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof OutgoingCall.action>) => {
      if (draft.isSpeaking) {
        return draft;
      }

      draft.interlocutorId = payload.callingUserId;
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

      // if a user canceled call or interlocutor declined call before a user allowed video then do nothing/don't process call
      const shouldPreventEternalCamera = yield call(preventEternalCamera);
      if (shouldPreventEternalCamera) {
        return;
      }

      const userInterlocutorId = action.payload.callingUserId;

      const offer: RTCSessionDescriptionInit = yield call(async () =>
        peerConnection?.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }),
      );

      yield spawn(peerWatcher);
      yield call(async () => peerConnection?.setLocalDescription(offer));

      yield call(waitForAllICE, peerConnection);

      const isVideoEnabled = yield select(getIsVideoEnabledSelector);

      if (peerConnection?.localDescription) {
        const request = {
          offer: peerConnection.localDescription,
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
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ISendCallOfferResponse>, ISendCallOfferRequest>(
      MAIN_API.SEND_CALL_OFFER,
      HttpRequestMethod.Post,
    );
  }
}
