import { CancelAvatarUploading } from './features/cancel-avatar-uploading/cancel-avatar-uploading';
import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { CheckNicknameAvailability } from './features/check-nickname-availability/check-nickname-availability';
import { ConfirmChangePhone } from './features/confirm-change-phone/confirm-change-phone';
import { ConfirmChangePhoneSuccess } from './features/confirm-change-phone/confirm-change-phone-success';
import { DeactivateAccount } from './features/deactivate-account/deactivate-acccount';
import { DeleteAccount } from './features/delete-account/delete-account';
import { GetMyProfile } from './features/get-my-profile/get-my-profile';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';
import { SendSmsChangePhone } from './features/send-sms-change-phone/send-sms-change-phone';
import { UpdateMyProfile } from './features/update-my-profile/update-my-profile';
import { UpdateMyProfileSuccess } from './features/update-my-profile/update-my-profile-success';
import { UploadAvatar } from './features/upload-avatar/upload-avatar';

export const updateMyProfileAction = UpdateMyProfile.action;
export const updateMyProfileSuccessAction = UpdateMyProfileSuccess.action;
export const checkNicknameAvailabilityAction = CheckNicknameAvailability.action;
export const getMyProfileAction = GetMyProfile.action;
export const getMyProfileSuccessAction = GetMyProfileSuccess.action;
export const changeUserOnlineStatusAction = ChangeUserOnlineStatus.action;
export const uploadAvatarRequestAction = UploadAvatar.action;
export const cancelAvatarUploadingRequestAction = CancelAvatarUploading.action;
export const deactivateAccountAction = DeactivateAccount.action;
export const deleteAccountAction = DeleteAccount.action;
export const sendSmsChangePhone = SendSmsChangePhone.action;
export const confirmChangePhone = ConfirmChangePhone.action;
export const confirmChangePhoneSuccess = ConfirmChangePhoneSuccess.action;

export const MyProfileActions = {
  updateMyProfileAction,
  updateMyProfileSuccessAction,
  checkNicknameAvailabilityAction,
  getMyProfileAction,
  getMyProfileSuccessAction,
  changeUserOnlineStatusAction,
  uploadAvatarRequestAction,
  cancelAvatarUploadingRequestAction,
  deleteAccountAction,
  deactivateAccountAction,
  sendSmsChangePhone,
  confirmChangePhone,
  confirmChangePhoneSuccess,
};
