import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { MyProfileService } from 'app/services/my-profile-service';
import { getFileFromUrl } from 'utils/functions/get-file-from-url';
import { CancelTokenSource } from 'axios';
import { UpdateMyProfileApiRequestData, UploadAvatarResponse, UploadAvatarSagaProgressData } from './models';
import { MyProfileActions } from './actions';
import { MyProfileHttpFileRequest, MyProfileHttpRequests } from './http-requests';

let avatarUploadCancelTokenSource: CancelTokenSource | undefined;

export function* changeOnlineStatus({ payload }: ReturnType<typeof MyProfileActions.changeUserOnlineStatusAction>): SagaIterator {
  try {
    const httpRequest = MyProfileHttpRequests.changeOnlineStatus;
    httpRequest.call(yield call(() => httpRequest.generator({ isOnline: payload })));
  } catch (err) {
    alert(err);
  }
}

export function* updateMyProfileSaga(action: ReturnType<typeof MyProfileActions.updateMyProfileAction>): SagaIterator {
  try {
    const requestData: UpdateMyProfileApiRequestData = {
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
      avatarId: action.payload.avatar?.id,
    };
    const updateProfileRequest = MyProfileHttpRequests.updateMyProfile;
    const { status } = updateProfileRequest.call(yield call(() => updateProfileRequest.generator(requestData)));

    if (status === 200) {
      yield put(MyProfileActions.updateMyProfileSuccessAction(action.payload));
    }
  } catch (err) {
    alert(err);
  }
}

export function* updateMyNicknameSaga(action: ReturnType<typeof MyProfileActions.updateMyNicknameAction>): SagaIterator {
  try {
    const updateNicknameRequest = MyProfileHttpRequests.updateMyNickName;
    const { status } = updateNicknameRequest.call(yield call(() => updateNicknameRequest.generator(action.payload)));

    if (status === 200) {
      yield put(MyProfileActions.updateMyNicknameActionSuccess(action.payload));
      action.meta.deferred?.resolve();
    } else {
      action.meta.deferred?.reject();
    }
  } catch {
    action.meta.deferred?.reject();
  }
}

export function* getMyProfileSaga(): SagaIterator {
  const profileService = new MyProfileService();
  const currentUserId = profileService.myProfile.id;

  const httpRequest = MyProfileHttpRequests.getUserProfile;
  const { data } = httpRequest.call(yield call(() => httpRequest.generator(currentUserId)));
  profileService.setMyProfile(data);
  yield put(MyProfileActions.getMyProfileSuccessAction(data));
}

export function* checkNicknameAvailabilitySaga(action: ReturnType<typeof MyProfileActions.checkNicknameAvailabilityAction>): SagaIterator {
  const httpRequest = MyProfileHttpRequests.checkNicknameAvailability;
  const { data } = httpRequest.call(yield call(() => httpRequest.generator({ nickname: action.payload.nickname })));

  action.meta.deferred?.resolve({ isAvailable: data });
}

function* uploadAvatarSaga(action: ReturnType<typeof MyProfileActions.uploadAvatarRequestAction>): SagaIterator {
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
  takeLatest(MyProfileActions.updateMyProfileAction, updateMyProfileSaga),
  takeLatest(MyProfileActions.updateMyNicknameAction, updateMyNicknameSaga),
  takeLatest(MyProfileActions.getMyProfileAction, getMyProfileSaga),
  takeLatest(MyProfileActions.checkNicknameAvailabilityAction, checkNicknameAvailabilitySaga),
  takeLatest(MyProfileActions.uploadAvatarRequestAction, uploadAvatarSaga),
  takeEvery(MyProfileActions.cancelAvatarUploadingRequestAction, cancelAvatarUploadingSaga),
  takeEvery(MyProfileActions.changeUserOnlineStatusAction, changeOnlineStatus),
];
