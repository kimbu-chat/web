import { CancelAvatarUploading } from './features/cancel-avatar-uploading/cancel-avatar-uploading';
import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { CheckNicknameAvailability } from './features/check-nickname-availability/check-nickname-availability';
import { GetMyProfile } from './features/get-my-profile/get-my-profile';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';
import { UpdateMyProfile } from './features/update-my-profile/update-my-profile';
import { UpdateMyProfileSuccess } from './features/update-my-profile/update-my-profile-success';
import { UploadAvatar } from './features/upload-avatar/upload-avatar';
import { UserEditedEventHandler } from './socket-events/user-edited-event-handler';

export const updateMyProfileAction = UpdateMyProfile.action;
export const updateMyProfileSuccessAction = UpdateMyProfileSuccess.action;
export const checkNicknameAvailabilityAction = CheckNicknameAvailability.action;
export const getMyProfileAction = GetMyProfile.action;
export const getMyProfileSuccessAction = GetMyProfileSuccess.action;
export const changeUserOnlineStatusAction = ChangeUserOnlineStatus.action;
export const uploadAvatarRequestAction = UploadAvatar.action;
export const cancelAvatarUploadingRequestAction = CancelAvatarUploading.action;
export const userEditedEventHandler = UserEditedEventHandler.action;