import { MyProfileService } from 'app/services/my-profile-service';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { IMyProfileState } from '../../my-profile-state';
import { IGetMyProfileSuccessActionPayload } from './action-payloads/get-my-profile-success-action-payload';

export class GetMyProfileSuccess {
  static get action() {
    return createAction('GET_MY_PROFILE_SUCCESS')<IGetMyProfileSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMyProfileState, { payload }: ReturnType<typeof GetMyProfileSuccess.action>) => ({
      ...draft,
      user: payload,
    }));
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetMyProfileSuccess.action>): SagaIterator {
      new MyProfileService().setMyProfile(action.payload);
    };
  }
}
