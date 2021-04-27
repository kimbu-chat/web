import { CancelAvatarUploading } from './features/cancel-avatar-uploading/cancel-avatar-uploading';
import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { CheckNicknameAvailability } from './features/check-nickname-availability/check-nickname-availability';
import { DeactivateAccount } from './features/deactivate-account/deactivate-acccount';
import { DeleteAccount } from './features/delete-account/delete-account';
import { GetMyProfile } from './features/get-my-profile/get-my-profile';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';
import { UpdateMyProfile } from './features/update-my-profile/update-my-profile';
import { UpdateMyProfileSuccess } from './features/update-my-profile/update-my-profile-success';
import { UploadAvatar } from './features/upload-avatar/upload-avatar';
import { UserDeactivatedEventHandler } from './socket-events/user-deactivated/user-deactivated-event-handler';
import { UserDeletedEventHandler } from './socket-events/user-deleted/user-deleted';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { UserPhoneNumberChangedEventHandler } from './socket-events/user-phone-number-changed/user-phone-number-changed';

export const updateMyProfileAction = UpdateMyProfile.action;
export const updateMyProfileSuccessAction = UpdateMyProfileSuccess.action;
export const checkNicknameAvailabilityAction = CheckNicknameAvailability.action;
export const getMyProfileAction = GetMyProfile.action;
export const getMyProfileSuccessAction = GetMyProfileSuccess.action;
export const changeUserOnlineStatusAction = ChangeUserOnlineStatus.action;
export const uploadAvatarRequestAction = UploadAvatar.action;
export const cancelAvatarUploadingRequestAction = CancelAvatarUploading.action;
export const userEditedEventHandlerAction = UserEditedEventHandler.action;
export const deactivateAccountAction = DeactivateAccount.action;
export const deleteAccountAction = DeleteAccount.action;
export const userDeactivatedEventHandler = UserDeactivatedEventHandler.action;
export const userDeletedEventHandler = UserDeletedEventHandler.action;
export const userPhoneNumberChangedEventHandler = UserPhoneNumberChangedEventHandler.action;

export const MyProfileActions = {
  updateMyProfileAction,
  userDeactivatedEventHandler,
  updateMyProfileSuccessAction,
  checkNicknameAvailabilityAction,
  getMyProfileAction,
  getMyProfileSuccessAction,
  changeUserOnlineStatusAction,
  uploadAvatarRequestAction,
  cancelAvatarUploadingRequestAction,
  userEditedEventHandlerAction,
  deactivateAccountAction,
  userDeletedEventHandler,
  deleteAccountAction,
  userPhoneNumberChangedEventHandler,
};
