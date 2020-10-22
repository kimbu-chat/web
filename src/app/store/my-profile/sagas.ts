import { call, put, takeLatest, select } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { FileUploadRequest, ErrorUploadResponse, uploadFileSaga } from '../../utils/file-uploader/file-uploader';
import { AvatarSelectedData, UserPreview } from './models';
import { MyProfileActions } from './actions';
import { MyProfileHttpRequests } from './http-requests';
import { UpdateAvatarResponse } from '../common/models';
import { MyProfileService } from 'app/services/my-profile-service';
import { RootState } from '../root-reducer';

export function* changeOnlineStatus({
	payload,
}: ReturnType<typeof MyProfileActions.changeUserOnlineStatusAction>): SagaIterator {
	try {
		const httpRequest = MyProfileHttpRequests.changeOnlineStatus;
		httpRequest.call(yield call(() => httpRequest.generator({ isOnline: payload })));
	} catch (err) {
		alert(err);
	}
}

export function* uploadUserAvatar(action: ReturnType<typeof MyProfileActions.updateMyAvatarAction>): SagaIterator {
	const image: AvatarSelectedData = action.payload;

	const { croppedImagePath, imagePath, offsetY, offsetX, width } = image;
	if (!image || !imagePath || !croppedImagePath) {
		return;
	}

	const uploadRequest: FileUploadRequest<UpdateAvatarResponse> = {
		path: image.imagePath,
		url: 'https://files.ravudi.com/api/user-avatars/',
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
			yield put(MyProfileActions.updateMyAvatarSuccessAction(response.data));
			// action.payload.deferred?.resolve();
		},
	};

	yield call(uploadFileSaga, uploadRequest);
}

export function* uploadUserAvatarSaga(action: ReturnType<typeof MyProfileActions.updateMyAvatarAction>): SagaIterator {
	yield call(uploadUserAvatar, action);
	const updatedProfile: UserPreview = yield select((state: RootState) => state.myProfile.user);
	new MyProfileService().setMyProfile(updatedProfile);
}

export function* updateMyProfileSaga(action: ReturnType<typeof MyProfileActions.updateMyProfileAction>): SagaIterator {
	try {
		const updateProfileRequest = MyProfileHttpRequests.updateMyProfile;
		const { status } = updateProfileRequest.call(yield call(() => updateProfileRequest.generator(action.payload)));

		if (status === 200) {
			yield put(MyProfileActions.updateMyProfileSuccessAction(action.payload));
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

export const MyProfileSagas = [
	takeLatest(MyProfileActions.updateMyAvatarAction, uploadUserAvatarSaga),
	takeLatest(MyProfileActions.updateMyProfileAction, updateMyProfileSaga),
	takeLatest(MyProfileActions.getMyProfileAction, getMyProfileSaga),
	//takeEvery(MyProfileActions.changeUserOnlineStatus, changeOnlineStatus),
];
