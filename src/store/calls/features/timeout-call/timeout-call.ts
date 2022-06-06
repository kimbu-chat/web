import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { getCallInterlocutorIdSelector } from '@store/calls/selectors';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { resetPeerConnection } from '@store/middlewares/webRTC/reset-peer-connection';

import { CancelCallSuccess } from '../cancel-call/cancel-call-success';
import {createAction} from "@reduxjs/toolkit";

export class TimeoutCall {
  static get action() {
    return createAction('TIMEOUT_CALL');
  }

  static get saga() {
    return function* timeoutCallSaga(): SagaIterator {
      const interlocutorId: number = yield select(getCallInterlocutorIdSelector);

      const request = {
        interlocutorId,
      };

      yield call(() => TimeoutCall.httpRequest.generator(request));

      resetPeerConnection();

      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(MAIN_API.TIMEOUT_CALL, HttpRequestMethod.Post);
  }
}
