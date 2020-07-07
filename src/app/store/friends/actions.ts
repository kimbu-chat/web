import { createAction } from '../utils';
import { GetFriendsActionData, GetFriendsSuccessActionData } from '../user/interfaces';
import {
  GET_FRIENDS,
  GET_FRIENDS_SUCCESS,
  MARK_USER_AS_ADDED_TO_CONFERENCE,
  UNSET_SELECTED_USER_IDS_TO_ADD_INTO_CONFERENCE,
  DELETE_FRIEND_SUCCESS,
  DELETE_FRIEND
} from './types';

export const unsetSelectedUserIdsForNewConferenceAction = () =>
  createAction(UNSET_SELECTED_USER_IDS_TO_ADD_INTO_CONFERENCE);

export const getFriendsAction = (data: GetFriendsActionData) => createAction(GET_FRIENDS, data);
export const getFriendsSuccessAction = (data: GetFriendsSuccessActionData) => createAction(GET_FRIENDS_SUCCESS, data);

export const deleteFriendAction = (userId: number) => createAction(DELETE_FRIEND, userId);
export const deleteFriendSuccessAction = (userId: number) => createAction(DELETE_FRIEND_SUCCESS, userId);

export const markUserAsAddedToConferenceAction = (userId: number) =>
  createAction(MARK_USER_AS_ADDED_TO_CONFERENCE, userId);
