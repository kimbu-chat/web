import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { UserPreview } from './models';
import { MyProfileActions } from './actions';
import { MyProfileService } from 'app/services/my-profile-service';

export interface MyProfileState {
	user: UserPreview;
}

const authService = new MyProfileService();
const initialState: MyProfileState = {
	user: authService.myProfile,
};

const myProfile = createReducer<MyProfileState>(initialState)
	.handleAction(
		[MyProfileActions.updateMyAvatarSuccess],
		produce((draft: MyProfileState, { payload }: ReturnType<typeof MyProfileActions.updateMyAvatarSuccess>) => {
			if (draft.user) {
				draft.user.avatarUrl = payload.fullAvatarUrl;
			}
			return draft;
		}),
	)
	.handleAction(
		[MyProfileActions.getMyProfileSuccess],
		produce((draft: MyProfileState, { payload }: ReturnType<typeof MyProfileActions.getMyProfileSuccess>) => {
			return {
				...draft,
				user: payload,
			};
		}),
	);

export default myProfile;
