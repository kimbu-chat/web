import { UserPreview } from './../my-profile/models';
import { GetFriendsActionData, GetFriendsSuccessActionData } from '../my-profile/models';
import { createAction } from 'typesafe-actions';
import { StatusChangedIntegrationEvent } from '../middlewares/websockets/integration-events/status-changed-integration-event';
import { DeleteFriendsActionData } from './models';

export namespace FriendActions {
	export const getFriends = createAction('GET_FRIENDS')<GetFriendsActionData>();
	export const getFriendsSuccess = createAction('GET_FRIENDS_SUCCESS')<GetFriendsSuccessActionData>();
	export const deleteFriend = createAction('DELETE_FRIEND')<DeleteFriendsActionData>();
	export const deleteFriendSuccess = createAction('DELETE_FRIEND_SUCCESS')<DeleteFriendsActionData>();
	export const userStatusChangedEvent = createAction('USER_STATUS_CHANGED_EVENT')<StatusChangedIntegrationEvent>();
	export const addFriend = createAction('ADD_FRIEND')<UserPreview>();
	export const addFriendSuccess = createAction('ADD_FRIEND_SUCCESS')<UserPreview>();
}
