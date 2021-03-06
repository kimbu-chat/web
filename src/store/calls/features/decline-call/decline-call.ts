import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { resetPeerConnection } from '../../../middlewares/webRTC/reset-peer-connection';
import { ICallsState } from '../../calls-state';

export class DeclineCall {
  static get action() {
    return createAction('DECLINE_CALL');
  }

  static get reducer() {
    return (draft: ICallsState) => {
      draft.interlocutorId = undefined;
      draft.isInterlocutorBusy = false;
      draft.amICalling = false;
      draft.isCallAccepted = false;
      draft.amICalled = false;
      draft.isSpeaking = false;
      draft.isInterlocutorVideoEnabled = false;
      draft.isInterlocutorAudioEnabled = false;
      draft.videoConstraints.isOpened = false;
      draft.videoConstraints.isOpened = false;
      draft.isScreenSharingOpened = false;
      return draft;
    };
  }

  static get saga() {
    return function* declineCallSaga(): SagaIterator {
      resetPeerConnection();
      yield call(() => DeclineCall.httpRequest.generator());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(MAIN_API.DECLINE_CALL, HttpRequestMethod.Post);
  }
}
