import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { getPeerConnection } from '../../../middlewares/webRTC/peerConnectionFactory';
import { ICallsState } from '../../calls-state';
import { getCallInterlocutorIdSelector, getIsActiveCallIncomingSelector } from '../../selectors';

import {
  getIgnoreOffer,
  getIsSettingRemoteAnswerPending,
  getMakingOffer,
  setIgnoreOffer,
} from '../../utils/glare-utils';
import { IAcceptRenegotiationApiRequest } from './api-requests/accept-renegotiation-api-request';
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
        console.log('---I-G-N-O-R-E-D------------');
        return;
      }

      if (interlocutorId === action.payload.userInterlocutorId) {
        yield call(async () => peerConnection?.setRemoteDescription(action.payload.offer));

        const answer = yield call(async () => peerConnection?.createAnswer());
        yield call(async () => peerConnection?.setLocalDescription(answer));

        const request = {
          userInterlocutorId: interlocutorId,
          answer,
        };

        yield call(() => RenegotiationSentEventHandler.httpRequest.generator(request));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAcceptRenegotiationApiRequest>(
      `${window.__config.REACT_APP_MAIN_API}/api/calls/accept-renegotiation`,
      HttpRequestMethod.Post,
    );
  }
}
