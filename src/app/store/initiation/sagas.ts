import { AuthService } from "app/services/auth-service";
import { put, takeLatest, call } from "redux-saga/effects";
import { initSocketConnectionAction } from "../sockets/actions";
import { MyProfileActions } from "../my-profile/actions";
import { MyProfileService } from "app/services/my-profile-service";
import { MyProfileHttpRequests } from "../my-profile/http-requests";
import { FriendActions } from "../friends/actions";
import { SagaIterator } from "redux-saga";
import { InitActions } from "./actions";

function* initializeSaga(): SagaIterator {
  const authService = new AuthService();
  const authData = authService.securityTokens;

  if (!authData) {
    return;
  }

  yield put(initSocketConnectionAction());
  yield put(MyProfileActions.changeUserOnlineStatus(true));

  const profileService = new MyProfileService();

  const currentUserId = profileService.myProfile.id;

  const httpRequest = MyProfileHttpRequests.getUserProfile;
	const { data } = httpRequest.call(yield call(() => httpRequest.generator(currentUserId)));

  profileService.setMyProfile(data);

  yield put(
    FriendActions.getFriends({
      page: { offset: 0, limit: 100 },
      initializedBySearch: false
    })
  );

  yield put(MyProfileActions.getMyProfileSuccess(data));
}

export const InitiationSagas = [
  takeLatest(InitActions.init, initializeSaga),
];
