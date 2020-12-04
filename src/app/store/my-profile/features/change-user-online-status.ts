import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/common/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

export class ChangeUserOnlineStatus {
  static get action() {
    return createAction('CHANGE_ONLINE_STATUS')<boolean>();
  }

  static get saga() {
    return function* ({ payload }: ReturnType<typeof ChangeUserOnlineStatus.action>): SagaIterator {
      try {
        ChangeUserOnlineStatus.httpRequest.call(yield call(() => ChangeUserOnlineStatus.httpRequest.generator({ isOnline: payload })));
      } catch (err) {
        alert(err);
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, { isOnline: boolean }>(`${ApiBasePath.MainApi}/api/users/change-online-status`, HttpRequestMethod.Post);
  }
}
