import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';

import { UnblockUserSuccess } from './unblock-user-success';

export class UnblockUser {
  static get action() {
    return createDeferredAction<number>('UNBLOCK_USER');
  }

  static get saga() {
    return function* unblockUserSaga(action: ReturnType<typeof UnblockUser.action>): SagaIterator {
      yield call(() => UnblockUser.httpRequest.generator(action.payload));

      yield put(UnblockUserSuccess.action(action.payload));

      action.meta?.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, number>(
      (userId) => replaceInUrl(MAIN_API.REMOVE_FROM_BLACK_LIST, ['userId', userId]),
      HttpRequestMethod.Delete,
    );
  }
}
