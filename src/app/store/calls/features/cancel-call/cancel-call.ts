import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/http-file-factory';
import { ApiBasePath } from 'app/store/root-api';
import { RootState } from 'app/store/root-reducer';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { CancelCallApiRequest } from '../../models';
import { stopAllTracks } from '../../utils/user-media';
import { CancelCallSuccess } from './cancel-call-success';

export class CancelCall {
  static get action() {
    return createEmptyAction('CANCEL_CALL');
  }

  static get saga() {
    return function* cancelCallSaga(): SagaIterator {
      const interlocutorId: number = yield select((state: RootState) => state.calls.interlocutor?.id);

      stopAllTracks();

      const request = {
        interlocutorId,
      };

      CancelCall.httpRequest.call(yield call(() => CancelCall.httpRequest.generator(request)));

      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, CancelCallApiRequest>(`${ApiBasePath.NotificationsApi}/api/calls/cancel-call`, HttpRequestMethod.Post);
  }
}
