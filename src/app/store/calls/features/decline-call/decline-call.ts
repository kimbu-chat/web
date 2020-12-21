import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { getCallInterlocutorIdSelector } from 'app/store/calls/selectors';
import { CallState, DeclineCallApiRequest } from '../../models';

export class DeclineCall {
  static get action() {
    return createEmptyAction('DECLINE_CALL');
  }

  static get reducer() {
    return produce((draft: CallState) => {
      draft.interlocutor = undefined;
      draft.isInterlocutorBusy = false;
      draft.amICaling = false;
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
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);

      const request = {
        interlocutorId,
      };

      resetPeerConnection();

      DeclineCall.httpRequest.call(yield call(() => DeclineCall.httpRequest.generator(request)));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, DeclineCallApiRequest>(`${ApiBasePath.MainApi}/api/calls/decline-call`, HttpRequestMethod.Post);
  }
}
