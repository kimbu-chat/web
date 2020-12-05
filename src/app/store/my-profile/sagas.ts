import { takeEvery, takeLatest } from 'redux-saga/effects';
import { UpdateMyProfile } from './features/update-my-profile/update-my-profile';
import { CheckNicknameAvailability } from './features/check-nickname-availability/check-nickname-availability';
import { GetMyProfile } from './features/get-my-profile/get-my-profile';
import { UpdateMyNickname } from './features/update-my-nickname/update-my-nickname';
import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { CancelAvatarUploading } from './features/cancel-avatar-uploading/cancel-avatar-uploading';
import { UploadAvatar } from './features/upload-avatar/upload-avatar';

export const MyProfileSagas = [
  takeLatest(UpdateMyProfile.action, UpdateMyProfile.saga),
  takeLatest(UpdateMyNickname.action, UpdateMyNickname.saga),
  takeLatest(GetMyProfile.action, GetMyProfile.saga),
  takeLatest(CheckNicknameAvailability.action, CheckNicknameAvailability.saga),
  takeLatest(UploadAvatar.action, UploadAvatar.saga),
  takeEvery(CancelAvatarUploading.action, CancelAvatarUploading.saga),
  takeEvery(ChangeUserOnlineStatus.action, ChangeUserOnlineStatus.saga),
];
