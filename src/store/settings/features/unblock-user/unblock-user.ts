import { AxiosResponse } from 'axios';
import { IRemoveUserFromBlackListRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { UnblockUserSuccess } from './unblock-user-success';

export class UnblockUser {
  static get action() {
    return createAction('UNBLOCK_USER')<string, Meta>();
  }

  static get saga() {
    return function* unblockUserSaga(action: ReturnType<typeof UnblockUser.action>): SagaIterator {
      yield call(() => UnblockUser.httpRequest.generator({ userId: action.payload }));

      yield put(UnblockUserSuccess.action(action.payload));

      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IRemoveUserFromBlackListRequest>(
      MAIN_API.REMOVE_FROM_BLACK_LIST,
      HttpRequestMethod.Post,
    );
  }
}
