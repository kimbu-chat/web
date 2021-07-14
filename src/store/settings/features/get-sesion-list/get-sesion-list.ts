import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { deviceIdSelector } from '@store/auth/selectors';
import { createEmptyAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { ISession } from '../../comon/models/session';
import { IUserSettings } from '../../user-settings-state';

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

      const currentDeviceId = yield select(deviceIdSelector);

      const currentDeviceIndex = (data as ISession[])?.findIndex(
        ({ id }) => id === Number(currentDeviceId),
      );

      if (currentDeviceIndex > -1) {
        const currentDevice = data[currentDeviceIndex];
        data.splice(currentDeviceIndex, 1);
        data.unshift(currentDevice);
      }

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
