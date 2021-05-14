import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { createEmptyDefferedAction } from '@store/common/actions';
import { HttpRequestMethod, httpRequestFactory } from '@store/common/http';
import { MAIN_API } from '@common/paths';

export class DeactivateAccount {
  static get action() {
    return createEmptyDefferedAction('DEACTIVATE_ACCOUNT');
  }

  static get saga() {
    return function* getMyProfile(
      action: ReturnType<typeof DeactivateAccount.action>,
    ): SagaIterator {
      DeactivateAccount.httpRequest.call(
        yield call(() => DeactivateAccount.httpRequest.generator()),
      );

      action.meta.deferred.resolve();

      window.location.replace('logout');
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(MAIN_API.DEACTIVATE_ACCOUNT, HttpRequestMethod.Put);
  }
}
