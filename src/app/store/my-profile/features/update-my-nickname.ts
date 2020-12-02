import { Meta } from 'app/store/common/actions';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { MyProfileHttpRequests } from '../http-requests';
import { UpdateNicknameActionData } from '../models';
import { UpdateMyNicknameSuccess } from './update-my-nickname-success';

export class UpdateMyNickname {
  static get action() {
    return createAction('UPDATE_MY_NICKNAME')<UpdateNicknameActionData, Meta>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof UpdateMyNickname.action>): SagaIterator {
      try {
        const updateNicknameRequest = MyProfileHttpRequests.updateMyNickName;
        const { status } = updateNicknameRequest.call(yield call(() => updateNicknameRequest.generator(action.payload)));

        if (status === 200) {
          yield put(UpdateMyNicknameSuccess.action(action.payload));
          action.meta.deferred?.resolve();
        } else {
          action.meta.deferred?.reject();
        }
      } catch {
        action.meta.deferred?.reject();
      }
    };
  }
}
