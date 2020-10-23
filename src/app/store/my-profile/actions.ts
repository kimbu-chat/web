import {
	UpdateMyProfileActionData,
	UserPreview,
	AvatarSelectedData,
	UpdateAvatarSuccess,
	UpdateNicknameActionData,
	CheckNicknameActionData,
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
	export const updateMyAvatarAction = createAction('UPDATE_MY_AVATAR')<AvatarSelectedData, Meta>();
	export const updateMyAvatarSuccessAction = createAction('UPDATE_MY_AVATAR_SUCCESS')<UpdateAvatarSuccess>();
	export const getMyProfileAction = createEmptyAction('GET_MY_PROFILE');
	export const getMyProfileSuccessAction = createAction('GET_MY_PROFILE_SUCCESS')<UserPreview>();
	export const changeUserOnlineStatusAction = createAction('CHANGE_ONLINE_STATUS')<boolean>();
}
