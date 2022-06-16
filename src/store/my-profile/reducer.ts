import { createReducer } from '@reduxjs/toolkit';

import { MyProfileService } from '../../services/my-profile-service';

import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';
import { IMyProfileState } from './my-profile-state';

const authService = new MyProfileService();

const initialState: IMyProfileState = {
  userId: authService.myProfile?.id,
  isTabActive: true,
};

const reducer = createReducer<IMyProfileState>(initialState, (builder) =>
  builder
    .addCase(GetMyProfileSuccess.action, GetMyProfileSuccess.reducer)
    .addCase(ChangeUserOnlineStatus.action, ChangeUserOnlineStatus.reducer),
);

export default reducer;
