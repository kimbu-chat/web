import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MyProfileService } from '../../../../services/my-profile-service';
import { IMyProfileState } from '../../my-profile-state';

import { IGetMyProfileSuccessActionPayload } from './action-payloads/get-my-profile-success-action-payload';

export class GetMyProfileSuccess {
  static get action() {
    return createAction('GET_MY_PROFILE_SUCCESS')<IGetMyProfileSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IMyProfileState, { payload }: ReturnType<typeof GetMyProfileSuccess.action>) => {
        draft.userId = payload.user.id;

        return draft;
      },
    );
  }

  static get saga() {
    return function* getMyProfileSuccess(
      action: ReturnType<typeof GetMyProfileSuccess.action>,
    ): SagaIterator {
      const myProfileService = new MyProfileService();
      yield apply(myProfileService, myProfileService.setMyProfile, [action.payload.user]);
    };
  }
}
