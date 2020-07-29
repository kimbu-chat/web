import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { UserPreview } from './models';
import { MyProfileActions } from './actions';
import { MyProfileService } from 'app/services/my-profile-service';

export interface AuthState {
  user: UserPreview;
}

const authService = new MyProfileService();
console.warn(authService.myProfile)
const initialState: AuthState = {
  user: authService.myProfile
};

const myProfile = createReducer<AuthState>(initialState)
  .handleAction(
    [MyProfileActions.updateMyAvatarSuccess],
    produce((draft: AuthState, { payload }: ReturnType<typeof MyProfileActions.updateMyAvatarSuccess>) => {
      if (draft.user) {
        draft.user.avatarUrl = payload.fullAvatarUrl;
      }
      return draft;
    }),
  )
  .handleAction(
    [MyProfileActions.getMyProfileSuccess],
    produce((draft: AuthState, { payload }: ReturnType<typeof MyProfileActions.getMyProfileSuccess>) => {
      return {
        ...draft,
        user: payload
      };
    }),
  );

export default myProfile;