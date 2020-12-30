import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { RootState } from 'app/store/root-reducer';
import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { ICancelCallApiRequest } from '../../models';
import { CancelCallSuccess } from './cancel-call-success';

export class CancelCall {
  static get action() {
    return createEmptyAction('CANCEL_CALL');
  }

  static get saga() {
    return function* cancelCallSaga(): SagaIterator {
      resetPeerConnection();

      const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);

      const request = {
        interlocutorId,
      };

      CancelCall.httpRequest.call(yield call(() => CancelCall.httpRequest.generator(request)));

      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, ICancelCallApiRequest>(`${ApiBasePath.MainApi}/api/calls/cancel-call`, HttpRequestMethod.Post);
  }
}
