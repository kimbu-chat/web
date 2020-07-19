import { createAction } from '../utils';
import { GetFriendsActionData, GetFriendsSuccessActionData } from '../user/interfaces';
import { FriendsActionTypes } from './types';
import { userStatusChangedEventAction } from '../dialogs/actions';
import { DialogsActionTypes } from '../dialogs/types';
import { getConferenceUsersSuccessActionData } from '../contacts/types';

export const unsetSelectedUserIdsForNewConferenceAction = () =>
  createAction(FriendsActionTypes.UNSET_SELECTED_USER_IDS_TO_ADD_INTO_CONFERENCE);

export const getFriendsAction = (data: GetFriendsActionData) => createAction(FriendsActionTypes.GET_FRIENDS, data);
export const getFriendsSuccessAction = (data: GetFriendsSuccessActionData) =>
  createAction(FriendsActionTypes.GET_FRIENDS_SUCCESS, data);

export const deleteFriendAction = (userId: number) => createAction(FriendsActionTypes.DELETE_FRIEND, userId);
export const deleteFriendSuccessAction = (userId: number) =>
  createAction(FriendsActionTypes.DELETE_FRIEND_SUCCESS, userId);

export const markUserAsAddedToConferenceAction = (userId: number) =>
  createAction(FriendsActionTypes.MARK_USER_AS_ADDED_TO_CONFERENCE, userId);

export const getConferenceUsers = () => createAction(DialogsActionTypes.GET_CONFERENCE_USERS);
export const unsetConferenceUsers = () => createAction(DialogsActionTypes.UNSET_CONFERENCE_USERS);

export const getConferenceUsersSuccess = (data: getConferenceUsersSuccessActionData) =>
  createAction(DialogsActionTypes.GET_CONFERENCE_USERS_SUCCESS, data);

export type FriendsActions =
  | typeof unsetSelectedUserIdsForNewConferenceAction
  | typeof getFriendsAction
  | typeof getFriendsSuccessAction
  | typeof deleteFriendAction
  | typeof deleteFriendSuccessAction
  | typeof markUserAsAddedToConferenceAction
  | typeof userStatusChangedEventAction
  | typeof getConferenceUsers
  | typeof unsetConferenceUsers
  | typeof getConferenceUsersSuccess;
