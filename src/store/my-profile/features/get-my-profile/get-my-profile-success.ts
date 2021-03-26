import { apply } from '@redux-saga/core/effects';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { MyProfileService } from '../../../../services/my-profile-service';
import { IMyProfileState } from '../../my-profile-state';
import { IGetMyProfileSuccessActionPayload } from './action-payloads/get-my-profile-success-action-payload';

export class GetMyProfileSuccess {
  static get action() {
    return createAction('GET_MY_PROFILE_SUCCESS')<IGetMyProfileSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMyProfileState, { payload }: ReturnType<typeof GetMyProfileSuccess.action>) => {
      draft.user = payload.user;

      return draft;
    });
  }

  static get saga() {
    return function* getMyProfileSuccess(action: ReturnType<typeof GetMyProfileSuccess.action>): SagaIterator {
      const myProfileService = new MyProfileService();
      yield apply(myProfileService, myProfileService.setMyProfile, [action.payload.user])
    };
  }
}
