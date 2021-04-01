import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { IUser } from '@store/common/models';
import { createAction } from 'typesafe-actions';
import { Meta } from '../../../common/actions';
import { IBlockUserApiRequest } from './api-requests/block-user-api-request';
import { BlockUserSuccess } from './block-user-success';

export class BlockUser {
  static get action() {
    return createAction('BLOCK_USER')<IUser, Meta>();
  }

  static get saga() {
    return function* addFriend(action: ReturnType<typeof BlockUser.action>): SagaIterator {
      yield call(() => BlockUser.httpRequest.generator({ userIds: [action.payload.id] }));

      yield put(BlockUserSuccess.action(action.payload));

      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IBlockUserApiRequest>(
      `${process.env.REACT_APP_MAIN_API}/api/black-list`,
      HttpRequestMethod.Post,
    );
  }
}
