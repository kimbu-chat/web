import { GetFriendsActionData, GetFriendsSuccessActionData } from '../my-profile/models';
import { createEmptyAction } from '../common/actions';
import { createAction } from 'typesafe-actions';
import { StatusChangedIntegrationEvent } from '../middlewares/websockets/integration-events/status-changed-integration-event';

export namespace FriendActions {
	export const unsetSelectedUserIdsForNewConference = createEmptyAction(
		'UNSET_SELECTED_USER_IDS_TO_ADD_INTO_CONFERENCE',
	);
	export const getFriends = createAction('GET_FRIENDS')<GetFriendsActionData>();
	export const getFriendsSuccess = createAction('GET_FRIENDS_SUCCESS')<GetFriendsSuccessActionData>();
	export const deleteFriend = createAction('DELETE_FRIEND')<number>();
	export const deleteFriendSuccess = createAction('DELETE_FRIEND_SUCCESS')<number>();
	export const markUserAsAddedToConference = createAction('MARK_USER_AS_ADDED_TO_CONFERENCE')<number>();
	export const userStatusChangedEvent = createAction('USER_STATUS_CHANGED_EVENT')<StatusChangedIntegrationEvent>();
}
