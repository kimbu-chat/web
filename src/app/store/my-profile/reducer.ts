import { createReducer } from 'typesafe-actions';
import { MyProfileService } from 'app/services/my-profile-service';
import { MyProfileState } from './models';
import { GetMyProfileSuccess } from './features/get-my-profile-success';
import { UpdateMyNicknameSuccess } from './features/update-my-nickname-success';
import { UpdateMyProfileSuccess } from './features/update-my-profile-success';

const authService = new MyProfileService();
const initialState: MyProfileState = {
  user: authService.myProfile,
};

const myProfile = createReducer<MyProfileState>(initialState)
  .handleAction(GetMyProfileSuccess.action, GetMyProfileSuccess.reducer)
  .handleAction(UpdateMyProfileSuccess.action, UpdateMyProfileSuccess.reducer)
  .handleAction(UpdateMyNicknameSuccess.action, UpdateMyNicknameSuccess.reducer);

export default myProfile;
