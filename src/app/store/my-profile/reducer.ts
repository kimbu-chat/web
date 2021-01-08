import { createReducer } from 'typesafe-actions';
import { MyProfileService } from 'app/services/my-profile-service';
import { IMyProfileState } from './models';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';
import { UpdateMyProfileSuccess } from './features/update-my-profile/update-my-profile-success';
import { UserEditedEventHandler } from './socket-events/user-edited-event-handler';

const authService = new MyProfileService();
const initialState: IMyProfileState = {
  user: authService.myProfile,
};

const myProfile = createReducer<IMyProfileState>(initialState)
  .handleAction(GetMyProfileSuccess.action, GetMyProfileSuccess.reducer)
  .handleAction(UpdateMyProfileSuccess.action, UpdateMyProfileSuccess.reducer)
  .handleAction(UserEditedEventHandler.action, UserEditedEventHandler.reducer);

export default myProfile;
