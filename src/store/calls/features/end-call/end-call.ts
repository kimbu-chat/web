import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createEmptyAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { resetPeerConnection } from '@store/middlewares/webRTC/reset-peer-connection';

import { ICallsState } from '../../calls-state';

export class EndCall {
  static get action() {
    return createEmptyAction('END_CALL');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
      // reset all values that may change durting call to default
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
    });
  }

  static get saga() {
    return function* endCallSaga(): SagaIterator {
      resetPeerConnection();
      yield call(() => EndCall.httpRequest.generator());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(MAIN_API.END_CALL, HttpRequestMethod.Post);
  }
}
