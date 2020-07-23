import { changeOnlineStatusApi } from '../auth/api';
import { changeUserOnlineStatusAction, updateMyProfileAction, getMyProfileSuccessAction } from './actions';
import { call, put } from 'redux-saga/effects';
import { UserPreview } from './interfaces';
import { AxiosResponse } from 'axios';
import { getFriendsApi, deleteFriendApi } from '../contacts/api';
import { SagaIterator } from 'redux-saga';
import { FileUploadRequest, ErrorUploadResponse, uploadFileSaga } from '../../utils/fileUploader/fileuploader';
import {
  getFriendsAction,
  getFriendsSuccessAction,
  deleteFriendAction,
  deleteFriendSuccessAction
} from '../friends/actions';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { AuthService } from 'app/services/auth-service';
import { updateMyProfileApi, getUserProfileApi } from './api';
import { AvatarSelectedData } from './interfaces';
import { UpdateAvatarResponse } from '../utils';
import { updateMyAvatarSuccessAction, updateMyAvatarAction } from './actions';

export function* changeOnlineStatus(action: ReturnType<typeof changeUserOnlineStatusAction>): Iterator<any> {
  try {
    yield call(changeOnlineStatusApi, action.payload);
  } catch (err) {
    alert(err);
  }
}

export function* getFriendsSaga(action: ReturnType<typeof getFriendsAction>): Iterator<any> {
  const { name, initializedBySearch } = action.payload;
  // @ts-ignore
  const { data }: AxiosResponse<Array<UserPreview>> = yield call(getFriendsApi, action.payload);

  data.forEach((x) => {
    x.lastOnlineTime = new Date(x.lastOnlineTime || '');
  });

  yield put(
    getFriendsSuccessAction({
      users: data,
      name,
      initializedBySearch
    })
  );
}

export function* deleteFriendSaga(action: ReturnType<typeof deleteFriendAction>): Iterator<any> {
  const userId = action.payload;
  try {
    // @ts-ignore
    const { status }: AxiosResponse = yield call(deleteFriendApi, action.payload);
    if (status === HTTPStatusCode.OK) {
      yield put(deleteFriendSuccessAction(userId));
    } else {
      alert('Failed to delete contact');
    }
  } catch {
    alert('Failed to delete contact');
  }
}

export function* uploadUserAvatar(action: ReturnType<typeof updateMyAvatarAction>): SagaIterator {
  const image: AvatarSelectedData = action.payload;

  const { croppedImagePath, imagePath, offsetY, offsetX, width } = image;
  if (!image || !imagePath || !croppedImagePath) {
    return;
  }

  const uploadRequest: FileUploadRequest<UpdateAvatarResponse> = {
    path: image.imagePath,
    url: 'http://files.ravudi.com/api/user-avatars/',
    fileName: 'File',
    parameters: {
      'Square.Point.X': offsetX.toString(),
      'Square.Point.Y': offsetY.toString(),
      'Square.Size': width.toString()
    },
    errorCallback(response: ErrorUploadResponse): void {
      alert(response.error);
    },
    *completedCallback(response) {
      yield put(updateMyAvatarSuccessAction(response.data));
      action.deferred?.resolve();
    }
  };

  yield call(uploadFileSaga, uploadRequest);
}

export function* uploadUserAvatarSaga(action: ReturnType<typeof updateMyAvatarAction>): SagaIterator {
  yield call(uploadUserAvatar, action);
}

export function* updateMyProfileSaga(action: ReturnType<typeof updateMyProfileAction>): Iterator<any> {
  try {
    // @ts-ignore
    const { status }: AxiosResponse = yield call(updateMyProfileApi, action.payload);
    if (status === HTTPStatusCode.OK) {
      action.deferred?.resolve();
    } else {
      action.deferred?.reject();
    }
  } catch {
    action.deferred?.reject();
  }
}

export function* getMyProfileSaga(): any {
  const currentUserId = new AuthService().auth.userId;

  const { data }: AxiosResponse<UserPreview> = yield call(getUserProfileApi, currentUserId);
  yield put(getMyProfileSuccessAction(data));
}
