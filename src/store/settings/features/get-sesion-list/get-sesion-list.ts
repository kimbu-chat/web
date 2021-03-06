import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { ISession } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { deviceIdSelector } from '@store/auth/selectors';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { IUserSettings } from '../../user-settings-state';

import { GetSessionListSuccess } from './get-sesion-list-success';

export class GetSessionList {
  static get action() {
    return createAction('GET_SESSION_LIST');
  }

  static get reducer() {
    return (draft: IUserSettings) => {
      draft.sessionList.isLoading = true;
      return draft;
    };
  }

  static get saga() {
    return function* getSessionListSaga(): SagaIterator {
      const { data } = GetSessionList.httpRequest.call(
        yield call(() => GetSessionList.httpRequest.generator()),
      );

      const currentDeviceId = yield select(deviceIdSelector);

      const currentDeviceIndex = data?.findIndex(({ id }) => id === Number(currentDeviceId));

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
