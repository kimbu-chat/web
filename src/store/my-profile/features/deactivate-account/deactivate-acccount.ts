import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { Logout } from '@store/auth/features/logout/logout';
import {createDeferredAction} from "@store/common/actions";
import { HttpRequestMethod, httpRequestFactory } from '@store/common/http';

export class DeactivateAccount {
  static get action() {
    return createDeferredAction('DEACTIVATE_ACCOUNT');
  }

  static get saga() {
    return function* getMyProfile(
      action: ReturnType<typeof DeactivateAccount.action>,
    ): SagaIterator {
      DeactivateAccount.httpRequest.call(
        yield call(() => DeactivateAccount.httpRequest.generator()),
      );

      action.meta?.deferred?.resolve();

      yield call(Logout.saga);
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse>(MAIN_API.DEACTIVATE_ACCOUNT, HttpRequestMethod.Put);
  }
}
