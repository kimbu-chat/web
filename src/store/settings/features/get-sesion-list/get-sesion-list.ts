import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createEmptyAction } from '@app/store/common/actions';
import produce from 'immer';
import { IUserSettings } from '../../user-settings-state';
import { GetSessionListSuccess } from './get-sesion-list-success';
import { ISession } from '../../comon/models/session';

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
    return httpRequestFactory<AxiosResponse<ISession[]>>(`${process.env.MAIN_API}/api/sessions`, HttpRequestMethod.Get);
  }
}
