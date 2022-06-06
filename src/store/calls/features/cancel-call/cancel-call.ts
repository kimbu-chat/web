import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { resetPeerConnection } from '@store/middlewares/webRTC/reset-peer-connection';

import { CancelCallSuccess } from './cancel-call-success';
import {createAction} from "@reduxjs/toolkit";

export class CancelCall {
  static get action() {
    return createAction('CANCEL_CALL');
  }

  static get saga() {
    return function* cancelCallSaga(): SagaIterator {
      resetPeerConnection();

      yield call(() => CancelCall.httpRequest.generator());
      yield put(CancelCallSuccess.action());
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(MAIN_API.CANCEL_CALL, HttpRequestMethod.Post);
  }
}
