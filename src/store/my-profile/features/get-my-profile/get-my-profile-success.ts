import { createAction } from '@reduxjs/toolkit';
import { IUser } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';

import { MyProfileService } from '../../../../services/my-profile-service';
import { IMyProfileState } from '../../my-profile-state';

export class GetMyProfileSuccess {
  static get action() {
    return createAction<IUser>('GET_MY_PROFILE_SUCCESS');
  }

  static get reducer() {
    return (draft: IMyProfileState, { payload }: ReturnType<typeof GetMyProfileSuccess.action>) => {
        draft.userId = payload.id;

        return draft;
      }
  }

  static get saga() {
    return function* getMyProfileSuccess(
      action: ReturnType<typeof GetMyProfileSuccess.action>,
    ): SagaIterator {
      const myProfileService = new MyProfileService();
      yield apply(myProfileService, myProfileService.setMyProfile, [action.payload]);
    };
  }
}
