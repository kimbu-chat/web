import { createAction } from '../utils';
import { userActionTypes } from './types';
import { UpdateMyProfileActionData, UserPreview, AvatarSelectedData, UpdateAvatarResponse } from './interfaces';

export const changeUserOnlineStatusAction = (isOnline: boolean) =>
  createAction(userActionTypes.CHANGE_ONLINE_STATUS, isOnline);
export const updateMyProfileAction = (data: UpdateMyProfileActionData) =>
  createAction(userActionTypes.UPDATE_MY_PROFILE_INFO, data);
export const updateMyAvatarAction = (data: AvatarSelectedData) => createAction(userActionTypes.UPDATE_MY_AVATAR, data);
export const updateMyAvatarSuccessAction = (data: UpdateAvatarResponse) =>
  createAction(userActionTypes.UPDATE_MY_AVATAR_SUCCESS, data);
export const getMyProfileAction = () => createAction(userActionTypes.GET_MY_PROFILE);
export const getMyProfileSuccessAction = (data: UserPreview) =>
  createAction(userActionTypes.GET_MY_PROFILE_SUCCESS, data);

export type userActions =
  | typeof changeUserOnlineStatusAction
  | typeof updateMyProfileAction
  | typeof updateMyAvatarAction
  | typeof updateMyAvatarSuccessAction
  | typeof getMyProfileAction
  | typeof getMyProfileSuccessAction;
