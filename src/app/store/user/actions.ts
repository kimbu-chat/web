import { createAction } from '../utils';
import { CHANGE_ONLINE_STATUS, UPDATE_MY_PROFILE_INFO, GET_MY_PROFILE, GET_MY_PROFILE_SUCCESS } from './types';
import { UpdateMyProfileActionData, UserPreview } from './interfaces';
//import { Image } from 'react-native-image-crop-picker';

export const changeUserOnlineStatusAction = (isOnline: boolean) => createAction(CHANGE_ONLINE_STATUS, isOnline);
export const updateMyProfileAction = (data: UpdateMyProfileActionData) => createAction(UPDATE_MY_PROFILE_INFO, data);
//export const updateMyAvatarAction = (data: Image) => createAction(UPDATE_MY_AVATAR, data);
export const getMyProfileAction = () => createAction(GET_MY_PROFILE);
export const getMyProfileSuccessAction = (data: UserPreview) => createAction(GET_MY_PROFILE_SUCCESS, data);
