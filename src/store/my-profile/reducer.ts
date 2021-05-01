import { createReducer } from 'typesafe-actions';
import produce from 'immer';
import { MyProfileService } from '../../services/my-profile-service';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';
import { UpdateMyProfileSuccess } from './features/update-my-profile/update-my-profile-success';
import { UserEditedEventHandler } from '../users/socket-events/user-edited/user-edited-event-handler';
import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { IMyProfileState } from './my-profile-state';
import { UserPhoneNumberChangedEventHandler } from '../users/socket-events/user-phone-number-changed/user-phone-number-changed';

const authService = new MyProfileService();
const initialState: IMyProfileState = {
  user: authService.myProfile,
  isTabActive: true,
};

const reducer = createReducer<IMyProfileState>(initialState)
  .handleAction(GetMyProfileSuccess.action, GetMyProfileSuccess.reducer)
  .handleAction(UpdateMyProfileSuccess.action, UpdateMyProfileSuccess.reducer)
  .handleAction(ChangeUserOnlineStatus.action, ChangeUserOnlineStatus.reducer)
  .handleAction(
    UserPhoneNumberChangedEventHandler.action,
    produce(
      (
        draft: IMyProfileState,
        { payload }: ReturnType<typeof UserPhoneNumberChangedEventHandler.action>,
      ) => {
        const { userId, phoneNumber } = payload;

        if (userId === draft.user?.id) {
          draft.user.phoneNumber = phoneNumber;
        }

        return draft;
      },
    ),
  )
  .handleAction(
    UserEditedEventHandler.action,
    produce(
      (draft: IMyProfileState, { payload }: ReturnType<typeof UserEditedEventHandler.action>) => {
        const {
          userId,
          firstName,
          lastName,
          nickname,
          avatarId,
          avatarUrl,
          avatarPreviewUrl,
        } = payload;

        if (userId === draft.user?.id) {
          draft.user.firstName = firstName;
          draft.user.lastName = lastName;
          draft.user.nickname = nickname;

          draft.user.avatar = {
            id: avatarId,
            url: avatarUrl,
            previewUrl: avatarPreviewUrl,
          };
        }

        return draft;
      },
    ),
  );

export default reducer;
