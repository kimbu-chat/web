import { AxiosResponse } from 'axios';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { PhoneConfirmationApiResponse, SecurityTokens, LoginResponse } from './types';
import { call, put, takeLatest, fork, spawn } from 'redux-saga/effects';
import jwtDecode from 'jwt-decode';
import { AuthService } from 'app/services/auth-service';
import { MyProfileService } from 'app/services/my-profile-service';
import { AuthActions } from './actions';
import { AuthHttpRequests } from './http-requests';
import { SagaIterator } from 'redux-saga';
import { InitActions } from '../initiation/actions';
import { getMyProfileSaga } from '../my-profile/sagas';
import { MyProfileActions } from '../my-profile/actions';
import { UserPreview } from '../my-profile/models';
import { UserStatus } from '../friends/models';
import { initializeSaga } from '../initiation/sagas';
import { messaging } from '../middlewares/firebase/firebase';
//@ts-ignore
import Fingerprint2 from '@fingerprintjs/fingerprintjs';
// import  FirebaseMessagingTypes  from 'firebase/messaging';

function* requestRefreshToken(): SagaIterator {
	const authService = new AuthService();

	const { refreshToken } = authService.securityTokens;
	const request = AuthHttpRequests.refreshToken;

	try {
		const { data }: AxiosResponse<LoginResponse> = request.call(
			yield call(() => request.generator({ refreshToken })),
		);
		new AuthService().initialize(data);
		yield put(AuthActions.refreshTokenSuccess(data));
	} catch (e) {
		yield put(AuthActions.refreshTokenFailure());
	}
}

async function getPushNotificationTokens(): Promise<{ tokenId: string; deviceId: string } | undefined> {
	const retrieveUniqueId = () =>
		new Promise<string>((resolve) => {
			new Fingerprint2.getV18({}, function (result: string) {
				resolve(result);
			});
		});

	async function retrieveApplicationToken(): Promise<{ tokenId: string; deviceId: string }> {
		const tokenId: string = await messaging().getToken();
		const deviceId: string = await retrieveUniqueId();
		return Promise.resolve({ tokenId, deviceId });
	}

	// Let's check if the browser supports notifications
	if (!('Notification' in window)) {
		alert('This browser does not support desktop notification');
	}

	// Let's check whether notification permissions have already been granted
	else if (Notification.permission === 'granted') {
		// If it's okay let's create a notification
		const tokens = await retrieveApplicationToken();
		return tokens;
	}

	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== 'denied') {
		const permission = await Notification.requestPermission();
		// If the user accepts, let's create a notification
		if (permission === 'granted') {
			const tokens = await retrieveApplicationToken();
			return tokens;
		}
	}

	return undefined;

	// At last, if the user has denied notifications, and you
	// want to be respectful there is no need to bother them any more.
}

function* initializePushNotifications(): SagaIterator {
	const tokens = yield call(getPushNotificationTokens);
	const httpRequest = AuthHttpRequests.subscribeToPushNotifications;
	httpRequest.call(yield call(() => httpRequest.generator(tokens)));
}

function* unsubscribePushNotifications(): SagaIterator {
	const tokens = yield call(getPushNotificationTokens);
	const httpRequest = AuthHttpRequests.unsubscribeFromPushNotifications;
	httpRequest.call(yield call(() => httpRequest.generator(tokens)));
}

function* sendSmsPhoneConfirmationCodeSaga(action: ReturnType<typeof AuthActions.sendSmsCode>): SagaIterator {
	const request = AuthHttpRequests.sendSmsConfirmationCode;
	const { data, status }: AxiosResponse<string> = request.call(
		yield call(() => request.generator({ phoneNumber: action.payload.phoneNumber })),
	);

	if (status !== HTTPStatusCode.OK) {
		yield put(AuthActions.sendSmsCodeFailure());
		alert('Sms Limit');
		return;
	}

	yield put(AuthActions.sendSmsCodeSuccess(data));
	action?.meta.deferred.resolve();
}

function* confirmPhoneNumberSaga(action: ReturnType<typeof AuthActions.confirmPhone>): SagaIterator {
	const request = AuthHttpRequests.confirmPhone;
	const { data }: AxiosResponse<PhoneConfirmationApiResponse> = request.call(
		yield call(() => request.generator(action.payload)),
	);

	if (data.isCodeCorrect && data.userExists) {
		yield call(authenticate, action);
	} else if (data.isCodeCorrect && !data.userExists) {
		alert('User can be registered using mobile app');
		// yield put(confirmPhoneSuccessAction());
		action?.meta.deferred.resolve();
	} else {
		action?.meta.deferred.reject();
		yield put(AuthActions.confirmPhoneFailure());
	}
}

function* authenticate(action: ReturnType<typeof AuthActions.confirmPhone>): SagaIterator {
	const request = AuthHttpRequests.login;
	const { data }: AxiosResponse<LoginResponse> = request.call(yield call(() => request.generator(action.payload)));

	const profileService = new MyProfileService();
	const myProfile: UserPreview = {
		id: parseInt(jwtDecode<{ unique_name: string }>(data.accessToken).unique_name, 10),
		firstName: '',
		lastName: '',
		lastOnlineTime: new Date(),
		phoneNumber: '',
		nickname: '',
		status: UserStatus.Online,
	};
	yield put(MyProfileActions.getMyProfileSuccessAction(myProfile));
	profileService.setMyProfile(myProfile);
	const securityTokens: SecurityTokens = {
		accessToken: data.accessToken,
		refreshToken: data.refreshToken,
	};

	const authService = new AuthService();
	authService.initialize(securityTokens);
	yield put(AuthActions.loginSuccess(securityTokens));
	yield put(InitActions.init());
	yield fork(initializeSaga);
	yield call(getMyProfileSaga);
	yield spawn(initializePushNotifications);
	action?.meta.deferred?.resolve();
}

function* logout(action: ReturnType<typeof AuthActions.logout>): SagaIterator {
	new AuthService().clear();
	new MyProfileService().clear();

	yield spawn(unsubscribePushNotifications);

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.getRegistrations()
			.then(function (registrations) {
				for (let registration of registrations) {
					registration.unregister();
				}
			})
			.catch(function (err) {
				console.log('Service Worker registration failed: ', err);
			});
	}

	yield call(async () => await messaging().deleteToken);

	action.meta.deferred?.resolve();
}

export const AuthSagas = [
	takeLatest(AuthActions.logout, logout),
	takeLatest(AuthActions.refreshToken, requestRefreshToken),
	takeLatest(AuthActions.confirmPhone, confirmPhoneNumberSaga),
	takeLatest(AuthActions.sendSmsCode, sendSmsPhoneConfirmationCodeSaga),
];
