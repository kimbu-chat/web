import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IAcceptRenegotiationRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { getPeerConnection } from '../../../middlewares/webRTC/peerConnectionFactory';
import { ICallsState } from '../../calls-state';
import {
  getCallInterlocutorIdSelector,
  getIsActiveCallIncomingSelector,
  getIsScreenSharingEnabledSelector,
  getIsVideoEnabledSelector,
} from '../../selectors';
import {
  getIgnoreOffer,
  getIsSettingRemoteAnswerPending,
  getMakingOffer,
  setIgnoreOffer,
} from '../../utils/glare-utils';

import { IRenegotiationSentIntegrationEvent } from './renegotiation-sent-integration-event';

export class RenegotiationSentEventHandler {
  static get action() {
    return createAction('RenegotiationSent')<IRenegotiationSentIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (
        draft: ICallsState,
        { payload }: ReturnType<typeof RenegotiationSentEventHandler.action>,
      ) => {
        if (!payload.isVideoEnabled) {
          draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;
        }
      },
    );
  }

  static get saga() {
    return function* negociationSaga(
      action: ReturnType<typeof RenegotiationSentEventHandler.action>,
    ): SagaIterator {
      const polite = yield select(getIsActiveCallIncomingSelector);
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);
      const peerConnection = getPeerConnection();
      const makingOffer = getMakingOffer();
      const isSettingRemoteAnswerPending = getIsSettingRemoteAnswerPending();
      const readyForOffer =
        !makingOffer &&
        (peerConnection?.signalingState === 'stable' || isSettingRemoteAnswerPending);
      const offerCollision = !readyForOffer;

      setIgnoreOffer(!polite && offerCollision);

      const ignoreOffer = getIgnoreOffer();

      if (ignoreOffer) {
        return;
      }

      if (interlocutorId === action.payload.userInterlocutorId) {
        yield call(async () => peerConnection?.setRemoteDescription(action.payload.offer));

        const answer = yield call(async () => peerConnection?.createAnswer());
        yield call(async () => peerConnection?.setLocalDescription(answer));

        // yield call(waitForAllICE, peerConnection);

        if (peerConnection?.localDescription) {
          const isVideoEnabled =
            (yield select(getIsVideoEnabledSelector)) ||
            (yield select(getIsScreenSharingEnabledSelector));

          const request: IAcceptRenegotiationRequest = {
            userInterlocutorId: interlocutorId,
            answer: peerConnection.localDescription,
            isVideoEnabled,
          };

          yield call(() => RenegotiationSentEventHandler.httpRequest.generator(request));
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAcceptRenegotiationRequest>(
      MAIN_API.ACCEPT_RENEGOTIATION,
      HttpRequestMethod.Post,
    );
  }
}
