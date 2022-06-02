import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IUser } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { IUserSettings } from '../../user-settings-state';

import { GetBlackListSuccess } from './get-black-list-success';

export class GetBlackList {
  static get action() {
    return createAction('GET_BLACK_LIST');
  }

  static get reducer() {
    return (draft: IUserSettings) => {
      draft.blackList.isLoading = true;
      return draft;
    };
  }

  static get saga() {
    return function* getBlackListSaga(): SagaIterator {
      const { data } = GetBlackList.httpRequest.call(
        yield call(() => GetBlackList.httpRequest.generator()),
      );

      yield put(GetBlackListSuccess.action(data));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser[]>>(MAIN_API.BLACK_LIST, HttpRequestMethod.Get);
  }
}
