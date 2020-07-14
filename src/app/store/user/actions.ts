import { createAction } from '../utils';
import { userActionTypes } from './types';
import { UpdateMyProfileActionData, UserPreview } from './interfaces';
//import { Image } from 'react-native-image-crop-picker';

export const changeUserOnlineStatusAction = (isOnline: boolean) =>
  createAction(userActionTypes.CHANGE_ONLINE_STATUS, isOnline);
export const updateMyProfileAction = (data: UpdateMyProfileActionData) =>
  createAction(userActionTypes.UPDATE_MY_PROFILE_INFO, data);
//export const updateMyAvatarAction = (data: Image) => createAction(UPDATE_MY_AVATAR, data);
export const getMyProfileAction = () => createAction(userActionTypes.GET_MY_PROFILE);
export const getMyProfileSuccessAction = (data: UserPreview) =>
  createAction(userActionTypes.GET_MY_PROFILE_SUCCESS, data);
