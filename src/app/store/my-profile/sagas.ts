import { call, takeEvery, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { getFileFromUrl } from 'utils/functions/get-file-from-url';
import { CancelTokenSource } from 'axios';
import { UploadAvatarResponse, UploadAvatarSagaProgressData } from './models';
import { MyProfileHttpFileRequest } from './http-requests';
import { UpdateMyProfile } from './features/update-my-profile';
import { CheckNicknameAvailability } from './features/check-nickname-availability';
import { GetMyProfile } from './features/get-my-profile';
import { UpdateMyNickname } from './features/update-my-nickname';
import { ChangeUserOnlineStatus } from './features/change-user-online-status';
import { CancelAvatarUploading } from './features/cancel-avatar-uploading';
import { UploadAvatar } from './features/upload-avatar';

export let avatarUploadCancelTokenSource: CancelTokenSource | undefined;

export function* uploadAvatarSaga(action: ReturnType<typeof UploadAvatar.action>): SagaIterator {
  const { pathToFile, onProgress } = action.payload;

  const file = yield call(getFileFromUrl, pathToFile);

  const uploadRequest = MyProfileHttpFileRequest.uploadAvatar;

  const data = new FormData();

  const uploadData = { file };

  Object.entries(uploadData).forEach((k) => {
    data.append(k[0], k[1]);
  });

  yield call(() =>
    uploadRequest.generator(data, {
      *onStart({ cancelTokenSource }): SagaIterator {
        avatarUploadCancelTokenSource = cancelTokenSource;
      },
      *onSuccess(payload: UploadAvatarResponse): SagaIterator {
        avatarUploadCancelTokenSource = undefined;
        action.meta.deferred.resolve(payload);
      },
      *onProgress(payload: UploadAvatarSagaProgressData): SagaIterator {
        if (onProgress) {
          onProgress(payload.progress);
        }
      },
      *onFailure(): SagaIterator {
        avatarUploadCancelTokenSource = undefined;
        action.meta.deferred.reject();
      },
    }),
  );
}

function* cancelAvatarUploadingSaga(): SagaIterator {
  avatarUploadCancelTokenSource?.cancel();
}

export const MyProfileSagas = [
  takeLatest(UpdateMyProfile.action, UpdateMyProfile.saga),
  takeLatest(UpdateMyNickname.action, UpdateMyNickname.saga),
  takeLatest(GetMyProfile.action, GetMyProfile.saga),
  takeLatest(CheckNicknameAvailability.action, CheckNicknameAvailability.saga),
  takeLatest(UploadAvatar.action, uploadAvatarSaga),
  takeEvery(CancelAvatarUploading.action, cancelAvatarUploadingSaga),
  takeEvery(ChangeUserOnlineStatus.action, ChangeUserOnlineStatus.saga),
];
