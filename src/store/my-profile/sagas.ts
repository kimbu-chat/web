import { all, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';

import { CancelAvatarUploading } from './features/cancel-avatar-uploading/cancel-avatar-uploading';
import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { CheckNicknameAvailability } from './features/check-nickname-availability/check-nickname-availability';
import { ConfirmChangePhone } from './features/confirm-change-phone/confirm-change-phone';
import { DeactivateAccount } from './features/deactivate-account/deactivate-acccount';
import { DeleteAccount } from './features/delete-account/delete-account';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';
import { GetMyProfile } from './features/get-my-profile/get-my-profile';
import { SendSmsChangePhone } from './features/send-sms-change-phone/send-sms-change-phone';
import { UpdateMyProfile } from './features/update-my-profile/update-my-profile';
import { UploadAvatar } from './features/upload-avatar/upload-avatar';

export function* myProfileSagas() {
  yield all([
    takeLatest(UpdateMyProfile.action, UpdateMyProfile.saga),
    takeLatest(GetMyProfile.action, GetMyProfile.saga),
    takeLatest(GetMyProfileSuccess.action, GetMyProfileSuccess.saga),
    takeLatest(CheckNicknameAvailability.action, CheckNicknameAvailability.saga),
    takeLeading(UploadAvatar.action, UploadAvatar.saga),
    takeLatest(ChangeUserOnlineStatus.action, ChangeUserOnlineStatus.saga),
    takeEvery(CancelAvatarUploading.action, CancelAvatarUploading.saga),
    takeLatest(DeactivateAccount.action, DeactivateAccount.saga),
    takeEvery(DeleteAccount.action, DeleteAccount.saga),
    takeLatest(SendSmsChangePhone.action, SendSmsChangePhone.saga),
    takeLatest(ConfirmChangePhone.action, ConfirmChangePhone.saga),
  ]);
}
