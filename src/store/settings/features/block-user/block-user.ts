import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { Meta } from '../../../common/actions';

import { IBlockUserApiRequest } from './api-requests/block-user-api-request';
import { BlockUserSuccess } from './block-user-success';

export class BlockUser {
  static get action() {
    return createAction('BLOCK_USER')<number, Meta>();
  }

  static get saga() {
    return function* addFriend(action: ReturnType<typeof BlockUser.action>): SagaIterator {
      yield call(() => BlockUser.httpRequest.generator({ userIds: [action.payload] }));

      yield put(BlockUserSuccess.action(action.payload));

      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IBlockUserApiRequest>(
      MAIN_API.BLACK_LIST,
      HttpRequestMethod.Post,
    );
  }
}
