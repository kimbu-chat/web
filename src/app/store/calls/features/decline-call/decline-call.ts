import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { ICallState } from '../../models';

export class DeclineCall {
  static get action() {
    return createEmptyAction('DECLINE_CALL');
  }

  static get reducer() {
    return produce((draft: ICallState) => {
      draft.interlocutor = undefined;
      draft.isInterlocutorBusy = false;
      draft.amICalling = false;
      draft.amICalled = false;
      draft.isSpeaking = false;
      draft.isInterlocutorVideoEnabled = false;
      draft.videoConstraints.isOpened = false;
      draft.videoConstraints.isOpened = false;
      draft.isScreenSharingOpened = false;
      return draft;
    });
  }

  static get saga() {
    return function* declineCallSaga(): SagaIterator {
      resetPeerConnection();

      DeclineCall.httpRequest.call(yield call(() => DeclineCall.httpRequest.generator()));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, {}>(`${process.env.MAIN_API}/api/calls/decline-call`, HttpRequestMethod.Post);
  }
}
