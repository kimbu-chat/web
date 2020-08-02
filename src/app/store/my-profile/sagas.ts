import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { FileUploadRequest, ErrorUploadResponse, uploadFileSaga } from '../../utils/fileUploader/fileuploader';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { AvatarSelectedData } from './models';
import { MyProfileActions } from './actions';
import { MyProfileHttpRequests } from './http-requests';
import { UpdateAvatarResponse } from '../common/models';
import { MyProfileService } from 'app/services/my-profile-service';

export function* changeOnlineStatus({
	payload,
}: ReturnType<typeof MyProfileActions.changeUserOnlineStatus>): SagaIterator {
	try {
		const httpRequest = MyProfileHttpRequests.changeOnlineStatus;
		httpRequest.call(yield call(() => httpRequest.generator({ isOnline: payload })));
	} catch (err) {
		alert(err);
	}
}

export function* uploadUserAvatar(action: ReturnType<typeof MyProfileActions.updateMyAvatar>): SagaIterator {
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
			'Square.Size': width.toString(),
		},
		errorCallback(response: ErrorUploadResponse): void {
			alert(response.error);
		},
		*completedCallback(response) {
			yield put(MyProfileActions.updateMyAvatarSuccess(response.data));
			// action.payload.deferred?.resolve();
		},
	};

	yield call(uploadFileSaga, uploadRequest);
}

export function* uploadUserAvatarSaga(action: ReturnType<typeof MyProfileActions.updateMyAvatar>): SagaIterator {
	yield call(uploadUserAvatar, action);
	const updatedProfile = yield select((state) => state.myProfile.user);
	new MyProfileService().setMyProfile(updatedProfile);
}

export function* updateMyProfileSaga(action: ReturnType<typeof MyProfileActions.updateMyProfile>): SagaIterator {
	try {
		// @ts-ignore
		const { status }: AxiosResponse = yield call(updateMyProfileApi, action.payload);
		if (status === HTTPStatusCode.OK) {
			action.meta.deferred?.resolve();
		} else {
			action.meta.deferred?.reject();
		}
	} catch {
		action.meta.deferred?.reject();
	}
}

export function* getMyProfileSaga(): any {
	const profileService = new MyProfileService();
	const currentUserId = profileService.myProfile.id;

	const httpRequest = MyProfileHttpRequests.getUserProfile;
	const { data } = httpRequest.call(yield call(() => httpRequest.generator(currentUserId)));
	profileService.setMyProfile(data);
	yield put(MyProfileActions.getMyProfileSuccess(data));
}

export const MyProfileSagas = [
	takeLatest(MyProfileActions.updateMyAvatar, uploadUserAvatarSaga),
	takeLatest(MyProfileActions.updateMyProfile, updateMyProfileSaga),
	takeLatest(MyProfileActions.getMyProfile, getMyProfileSaga),
	takeEvery(MyProfileActions.changeUserOnlineStatus, changeOnlineStatus),
];
