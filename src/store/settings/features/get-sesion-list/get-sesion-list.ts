import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import produce from 'immer';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createEmptyAction } from '@store/common/actions';
import { MAIN_API } from '@common/paths';

import { IUserSettings } from '../../user-settings-state';
import { ISession } from '../../comon/models/session';

import { GetSessionListSuccess } from './get-sesion-list-success';

export class GetSessionList {
  static get action() {
    return createEmptyAction('GET_SESSION_LIST');
  }

  static get reducer() {
    return produce((draft: IUserSettings) => {
      draft.sessionList.isLoading = true;
      return draft;
    });
  }

  static get saga() {
    return function* addFriend(): SagaIterator {
      const { data } = yield call(() => GetSessionList.httpRequest.generator());

      yield put(GetSessionListSuccess.action(data));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ISession[]>>(
      MAIN_API.USER_SESSIONS,
      HttpRequestMethod.Get,
    );
  }
}
