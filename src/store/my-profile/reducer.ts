import { createReducer } from 'typesafe-actions';
import { MyProfileService } from '../../services/my-profile-service';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';
import { UpdateMyProfileSuccess } from './features/update-my-profile/update-my-profile-success';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { IMyProfileState } from './my-profile-state';
import { UserPhoneNumberChangedEventHandler } from './socket-events/user-phone-number-changed/user-phone-number-changed';

const authService = new MyProfileService();
const initialState: IMyProfileState = {
  user: authService.myProfile,
  isTabActive: true,
};

const reducer = createReducer<IMyProfileState>(initialState)
  .handleAction(GetMyProfileSuccess.action, GetMyProfileSuccess.reducer)
  .handleAction(UpdateMyProfileSuccess.action, UpdateMyProfileSuccess.reducer)
  .handleAction(UserEditedEventHandler.action, UserEditedEventHandler.reducer)
  .handleAction(ChangeUserOnlineStatus.action, ChangeUserOnlineStatus.reducer)
  .handleAction(
    UserPhoneNumberChangedEventHandler.action,
    UserPhoneNumberChangedEventHandler.reducer,
  );

export default reducer;
