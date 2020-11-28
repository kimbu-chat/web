import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { MyProfileService } from 'app/services/my-profile-service';
import { UserPreview } from './models';
import { MyProfileActions } from './actions';

export interface MyProfileState {
  user?: UserPreview;
}

const authService = new MyProfileService();
const initialState: MyProfileState = {
  user: authService.myProfile,
};

const myProfile = createReducer<MyProfileState>(initialState)
  .handleAction(
    [MyProfileActions.getMyProfileSuccessAction],
    produce((draft: MyProfileState, { payload }: ReturnType<typeof MyProfileActions.getMyProfileSuccessAction>) => ({
      ...draft,
      user: payload,
    })),
  )
  .handleAction(
    [MyProfileActions.updateMyProfileSuccessAction],
    produce((draft: MyProfileState, { payload }: ReturnType<typeof MyProfileActions.updateMyProfileSuccessAction>) => {
      draft.user!.firstName = payload.firstName;
      draft.user!.lastName = payload.lastName;
      draft.user!.avatar = payload.avatar;

      return draft;
    }),
  )
  .handleAction(
    [MyProfileActions.updateMyNicknameActionSuccess],
    produce((draft: MyProfileState, { payload }: ReturnType<typeof MyProfileActions.updateMyNicknameActionSuccess>) => {
      draft.user!.nickname = payload.nickname;

      return draft;
    }),
  );

export default myProfile;
