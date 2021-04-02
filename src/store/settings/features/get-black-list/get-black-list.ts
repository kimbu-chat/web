import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createEmptyAction } from '@store/common/actions';
import { IUser } from '@store/common/models';
import produce from 'immer';
import { IUserSettings } from '../../user-settings-state';
import { GetBlackListSuccess } from './get-black-list-success';

export class GetBlackList {
  static get action() {
    return createEmptyAction('GET_BLACK_LIST');
  }

  static get reducer() {
    return produce((draft: IUserSettings) => {
      draft.blackList.isLoading = true;
      return draft;
    });
  }

  static get saga() {
    return function* addFriend(): SagaIterator {
      const { data } = yield call(() => GetBlackList.httpRequest.generator());

      yield put(GetBlackListSuccess.action(data));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser[]>>(
      `${window.__config.REACT_APP_MAIN_API}/api/black-list`,
      HttpRequestMethod.Get,
    );
  }
}
