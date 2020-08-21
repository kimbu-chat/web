import produce from 'immer';
import _ from 'lodash';
import { createReducer } from 'typesafe-actions';
import { UserPreview } from '../my-profile/models';
import { FriendActions } from './actions';
import { ChatActions } from '../dialogs/actions';

export interface FriendsState {
	loading: boolean;
	friends: UserPreview[];
	userIdsToAddIntoConference: number[];
	usersForSelectedConference: UserPreview[];
	conferenceUsersLoading: boolean;
}

const initialState: FriendsState = {
	loading: true,
	friends: [],
	usersForSelectedConference: [],
	userIdsToAddIntoConference: [],
	conferenceUsersLoading: false,
};

const checkUserExist = (userId: number, state: FriendsState): boolean => {
	return Boolean(state.friends.find(({ id }) => id === userId));
};

const findUserIndex = (userId: number, state: FriendsState): number => {
	return state.friends.findIndex(({ id }) => id === userId);
};

const friends = createReducer<FriendsState>(initialState)
	.handleAction(
		FriendActions.deleteFriendSuccess,
		produce((draft: FriendsState, { payload }: ReturnType<typeof FriendActions.deleteFriendSuccess>) => {
			payload.userIds.forEach((userId) => (draft.friends = draft.friends.filter(({ id }) => id != userId)));

			return draft;
		}),
	)
	.handleAction(
		ChatActions.getConferenceUsers,
		produce((draft: FriendsState) => {
			draft.conferenceUsersLoading = true;
			return draft;
		}),
	)
	.handleAction(
		FriendActions.unsetSelectedUserIdsForNewConference,
		produce((draft: FriendsState) => {
			for (const userId of draft.userIdsToAddIntoConference) {
				const userIndex = findUserIndex(userId, draft);
				if (draft.friends[userIndex]) {
					draft.friends[userIndex].supposedToAddIntoConference = false;
				}
			}

			draft.userIdsToAddIntoConference = [];
			return draft;
		}),
	)
	.handleAction(
		FriendActions.userStatusChangedEvent,
		produce((draft: FriendsState, { payload }: ReturnType<typeof FriendActions.userStatusChangedEvent>) => {
			const userId = payload.objectId;
			const isUserExist = checkUserExist(userId, draft);

			if (!isUserExist) {
				return draft;
			}

			const userIndex = findUserIndex(userId, draft);

			draft.friends[userIndex].status = payload.status;
			draft.friends[userIndex].lastOnlineTime = new Date();

			return draft;
		}),
	)
	.handleAction(
		ChatActions.getConferenceUsersSuccess,
		produce((draft: FriendsState, { payload }: ReturnType<typeof ChatActions.getConferenceUsersSuccess>) => {
			const { initiatedByScrolling } = payload;

			if (!initiatedByScrolling) {
				draft.conferenceUsersLoading = false;
				draft.usersForSelectedConference = payload.users;

				return draft;
			}

			draft.usersForSelectedConference = _.unionBy(draft.usersForSelectedConference, payload.users, 'id');

			return draft;
		}),
	)
	.handleAction(
		FriendActions.markUserAsAddedToConference,
		produce((draft: FriendsState, { payload }: ReturnType<typeof FriendActions.markUserAsAddedToConference>) => {
			const userId: number = payload;
			const userIndex = findUserIndex(userId, draft);
			const user: UserPreview = draft.friends[userIndex];

			const updatedAddedUserIdsForNewConference = draft.userIdsToAddIntoConference.includes(userId)
				? draft.userIdsToAddIntoConference.filter((x) => x !== userId)
				: draft.userIdsToAddIntoConference.concat(userId);

			if (draft.friends[userIndex]) {
				draft.friends[userIndex].supposedToAddIntoConference = !user.supposedToAddIntoConference;
			}

			draft.userIdsToAddIntoConference = updatedAddedUserIdsForNewConference;
			return draft;
		}),
	)
	.handleAction(
		FriendActions.getFriends,
		produce((draft: FriendsState) => {
			draft.loading = true;
			return draft;
		}),
	)
	.handleAction(
		FriendActions.getFriendsSuccess,
		produce((draft: FriendsState, { payload }: ReturnType<typeof FriendActions.getFriendsSuccess>) => {
			const { users, initializedBySearch } = payload;

			if (initializedBySearch) {
				draft.loading = false;
				draft.friends = users;

				return draft;
			}

			draft.friends = _.unionBy(draft.friends, users, 'id');

			return draft;
		}),
	);

export default friends;
