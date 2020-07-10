import { changeOnlineStatusApi } from '../auth/api';
import { changeUserOnlineStatusAction /*, updateMyProfileAction, getMyProfileSuccessAction */ } from './actions';
import { call, put } from 'redux-saga/effects';
import { UserPreview } from './interfaces';
import { AxiosResponse } from 'axios';
import { getFriendsApi /*deleteFriendApi*/ } from '../contacts/api';
import {
  getFriendsAction,
  getFriendsSuccessAction
  /* deleteFriendAction,
  deleteFriendSuccessAction*/
} from '../friends/actions';
// import { HTTPStatusCode } from 'app/common/http-status-code';
// import { updateMyProfileApi, getUserProfileApi } from './api';

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

// export function* deleteFriendSaga(action: ReturnType<typeof deleteFriendAction>): Iterator<any> {
//   const userId = action.payload;
//   try {
//     const { status }: AxiosResponse = yield call(deleteFriendApi, action.payload);
//     if (status === HTTPStatusCode.OK) {
//       yield put(deleteFriendSuccessAction(userId));
//       UserPreviewRepository.deleteFriend(userId);
//     } else {
//       Alert.alert('Failed to delete contact');
//     }
//   } catch {
//     Alert.alert('Failed to delete contact');
//   }
// }

// export function* updateMyProfileSaga(action: ReturnType<typeof updateMyProfileAction>): Iterator<any> {
//   try {
//     const { status }: AxiosResponse = yield call(updateMyProfileApi, action.payload);
//     if (status === HTTPStatusCode.OK) {
//       const { firstName, lastName, nickName } = action.payload;
//       UserPreviewRepository.updateProfilePartially(firstName, lastName, nickName);
//       action.deferred.resolve();
//     } else {
//       action.deferred.reject();
//     }
//   } catch {
//     action.deferred.reject();
//   }
// }

// export function* getMyProfileSaga(): any {
//   const userProfile = UserPreviewRepository.getMyProfile();
//   if (userProfile) {
//     yield put(getMyProfileSuccessAction(userProfile));
//   }

//   const isInternetAvailable: boolean = yield call(checkInternetConnection);

//   if (!isInternetAvailable) {
//     return;
//   }

//   const currentUserId = UserRepository.getUserAuthData().userId;

//   const { data }: AxiosResponse<UserPreview> = yield call(getUserProfileApi, currentUserId);
//   UserPreviewRepository.updateMyProfile(data);
//   yield put(getMyProfileSuccessAction(data));
// }
