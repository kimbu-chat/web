import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { ICallsState } from '../../models';

export class EndCall {
  static get action() {
    return createEmptyAction('END_CALL');
  }

  static get reducer() {
    return produce((draft: ICallsState) => {
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
    return function* endCallSaga(): SagaIterator {
      resetPeerConnection();

      EndCall.httpRequest.call(yield call(() => EndCall.httpRequest.generator()));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, {}>(`${process.env.MAIN_API}/api/calls/end-call`, HttpRequestMethod.Post);
  }
}
