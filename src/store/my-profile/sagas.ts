import { spawn, takeEvery, takeLatest } from 'redux-saga/effects';
import { UpdateMyProfile } from './features/update-my-profile/update-my-profile';
import { CheckNicknameAvailability } from './features/check-nickname-availability/check-nickname-availability';
import { GetMyProfile } from './features/get-my-profile/get-my-profile';
import { ChangeUserOnlineStatus } from './features/change-user-online-status/change-user-online-status';
import { CancelAvatarUploading } from './features/cancel-avatar-uploading/cancel-avatar-uploading';
import { UploadAvatar } from './features/upload-avatar/upload-avatar';
import { GetMyProfileSuccess } from './features/get-my-profile/get-my-profile-success';

export const MyProfileSagas = [
  spawn(GetMyProfile.saga),
  takeLatest(UpdateMyProfile.action, UpdateMyProfile.saga),
  takeLatest(GetMyProfile.action, GetMyProfile.saga),
  takeLatest(GetMyProfileSuccess.action, GetMyProfileSuccess.saga),
  takeLatest(CheckNicknameAvailability.action, CheckNicknameAvailability.saga),
  takeLatest(UploadAvatar.action, UploadAvatar.saga),
  takeEvery(CancelAvatarUploading.action, CancelAvatarUploading.saga),
  takeEvery(ChangeUserOnlineStatus.action, ChangeUserOnlineStatus.saga),
];
