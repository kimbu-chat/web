import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { peerConnection, resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { DeclineCallApiRequest } from '../../models';
import { getCallInterlocutorIdSelector } from '../../selectors';
import { stopAllTracks } from '../../utils/user-media';
import { CancelCallSuccess } from '../cancel-call/cancel-call-success';

export class DeclineCall {
  static get action() {
    return createEmptyAction('DECLINE_CALL');
  }

  static get saga() {
    return function* declineCallSaga(): SagaIterator {
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);

      const request = {
        interlocutorId,
      };

      DeclineCall.httpRequest.call(yield call(() => DeclineCall.httpRequest.generator(request)));

      peerConnection?.close();
      resetPeerConnection();

      stopAllTracks();
      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, DeclineCallApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/decline-call`, HttpRequestMethod.Post);
  }
}
