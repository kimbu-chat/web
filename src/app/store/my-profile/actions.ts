import { UpdateMyProfileActionData, UserPreview, AvatarSelectedData, UpdateAvatarSuccess } from './models';
import { Meta, createEmptyAction } from '../common/actions';
import { createAction } from 'typesafe-actions';

export namespace MyProfileActions {
  export const updateMyProfile = createAction('UPDATE_MY_PROFILE_INFO')<UpdateMyProfileActionData, Meta>();
  export const updateMyAvatar = createAction('UPDATE_MY_AVATAR')<AvatarSelectedData, Meta>();
  export const updateMyAvatarSuccess = createAction('UPDATE_MY_AVATAR_SUCCESS')<UpdateAvatarSuccess>();
  export const getMyProfile = createEmptyAction('GET_MY_PROFILE');
  export const getMyProfileSuccess = createAction('GET_MY_PROFILE_SUCCESS')<UserPreview>();
  export const changeUserOnlineStatus = createAction('CHANGE_ONLINE_STATUS')<boolean>();
}
