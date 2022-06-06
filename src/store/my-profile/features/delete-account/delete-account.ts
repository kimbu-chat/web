import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { HttpRequestMethod, httpRequestFactory } from '@store/common/http';
import {createDeferredAction} from "@store/common/actions";

export class DeleteAccount {
  static get action() {
    return createDeferredAction('DELETE_ACCOUNT');
  }

  static get saga() {
    return function* getMyProfile(action: ReturnType<typeof DeleteAccount.action>): SagaIterator {
      DeleteAccount.httpRequest.call(yield call(() => DeleteAccount.httpRequest.generator()));

      action.meta.deferred.resolve();

      window.location.replace('logout');
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(MAIN_API.DELETE_ACCOUNT, HttpRequestMethod.Delete);
  }
}
