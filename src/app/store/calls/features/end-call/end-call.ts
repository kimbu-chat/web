import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { ApiBasePath } from 'app/store/root-api';
import { RootState } from 'app/store/root-reducer';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, call } from 'redux-saga/effects';
import { CallState, EndCallApiRequest } from '../../models';

export class EndCall {
  static get action() {
    return createEmptyAction('END_CALL');
  }

  static get reducer() {
    return produce((draft: CallState) => {
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

      const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);

      const request = { interlocutorId };

      EndCall.httpRequest.call(yield call(() => EndCall.httpRequest.generator(request)));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, EndCallApiRequest>(`${ApiBasePath.MainApi}/api/calls/end-call`, HttpRequestMethod.Post);
  }
}
