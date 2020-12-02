import { Meta } from 'app/store/common/actions';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { MyProfileHttpRequests } from '../http-requests';
import { CheckNicknameActionData } from '../models';

export class CheckNicknameAvailability {
  static get action() {
    return createAction('CHECK_NICKNAME_AVAILABILITY')<CheckNicknameActionData, Meta>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof CheckNicknameAvailability.action>): SagaIterator {
      const httpRequest = MyProfileHttpRequests.checkNicknameAvailability;
      const { data } = httpRequest.call(yield call(() => httpRequest.generator({ nickname: action.payload.nickname })));

      action.meta.deferred?.resolve({ isAvailable: data });
    };
  }
}
