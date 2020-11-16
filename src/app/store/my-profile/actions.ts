import {
	UpdateMyProfileActionData,
	UserPreview,
	UpdateNicknameActionData,
	CheckNicknameActionData,
	UploadAvatarReqData,
} from './models';
import { Meta, createEmptyAction } from '../common/actions';
import { createAction } from 'typesafe-actions';

export namespace MyProfileActions {
	export const updateMyProfileAction = createAction('UPDATE_MY_PROFILE_INFO')<UpdateMyProfileActionData>();
	export const updateMyProfileSuccessAction = createAction('UPDATE_MY_PROFILE_INFO_SUCCESS')<
		UpdateMyProfileActionData
	>();
	export const updateMyNicknameAction = createAction('UPDATE_MY_NICKNAME')<UpdateNicknameActionData, Meta>();
	export const updateMyNicknameActionSuccess = createAction('UPDATE_MY_NICKNAME_SUCCESS')<UpdateNicknameActionData>();
	export const checkNicknameAvailabilityAction = createAction('CHECK_NICKNAME_AVAILABILITY')<
		CheckNicknameActionData,
		Meta
	>();
	export const getMyProfileAction = createEmptyAction('GET_MY_PROFILE');
	export const getMyProfileSuccessAction = createAction('GET_MY_PROFILE_SUCCESS')<UserPreview>();
	export const changeUserOnlineStatusAction = createAction('CHANGE_ONLINE_STATUS')<boolean>();
	export const uploadAvatarRequestAction = createAction('UPLOAD_AVATAR')<UploadAvatarReqData, Meta>();
	export const cancelAvatarUploadingRequestAction = createEmptyAction('CANCEL_AVATAR_UPLOADING');
}
