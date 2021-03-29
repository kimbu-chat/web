import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createAction } from 'typesafe-actions';
import { Meta } from '@app/store/common/actions';
import { IUnblockUserApiRequest } from './api-requests/unblock-user-api-request';
import { UnblockUserSuccess } from './unblock-user-success';

export class UnblockUser {
  static get action() {
    return createAction('UNBLOCK_USER')<number, Meta>();
  }

  static get saga() {
    return function* addFriend(action: ReturnType<typeof UnblockUser.action>): SagaIterator {
      yield call(() => UnblockUser.httpRequest.generator({ userIds: [action.payload] }));

      yield put(UnblockUserSuccess.action(action.payload));

      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IUnblockUserApiRequest>(`${process.env.MAIN_API}/api/black-list/batch-remove`, HttpRequestMethod.Post);
  }
}
