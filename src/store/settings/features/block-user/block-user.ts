import { AxiosResponse } from 'axios';
import { IAddUserIntoBlackListRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { createDeferredAction } from '../../../common/actions';

import { BlockUserSuccess } from './block-user-success';

export class BlockUser {
  static get action() {
    return createDeferredAction<number>('BLOCK_USER');
  }

  static get saga() {
    return function* blockUserSaga(action: ReturnType<typeof BlockUser.action>): SagaIterator {
      yield call(() => BlockUser.httpRequest.generator({ userId: action.payload }));

      yield put(BlockUserSuccess.action(action.payload));

      action.meta?.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAddUserIntoBlackListRequest>(
      MAIN_API.BLACK_LIST,
      HttpRequestMethod.Post,
    );
  }
}
