import { createReducer } from 'typesafe-actions';
import { MyProfileService } from '../../services/my-profile-service';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';
import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { IMyProfileState } from './my-profile-state';

const authService = new MyProfileService();
const initialState: IMyProfileState = {
  userId: authService.myProfile?.id,
  isTabActive: true,
};

const reducer = createReducer<IMyProfileState>(initialState)
  .handleAction(GetMyProfileSuccess.action, GetMyProfileSuccess.reducer)
  .handleAction(ChangeUserOnlineStatus.action, ChangeUserOnlineStatus.reducer);

export default reducer;
