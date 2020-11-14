import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { UserPreview } from '../my-profile/models';
import { FriendActions } from './actions';
import { ChatActions } from '../chats/actions';
import unionBy from 'lodash/unionBy';

export interface FriendsState {
	loading: boolean;
	friends: UserPreview[];
	hasMoreFriends: boolean;
	usersForSelectedGroupChat: UserPreview[];
	groupChatUsersLoading: boolean;
}

const initialState: FriendsState = {
	loading: true,
	friends: [],
	hasMoreFriends: true,
	usersForSelectedGroupChat: [],
	groupChatUsersLoading: false,
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
		ChatActions.getGroupChatUsers,
		produce((draft: FriendsState) => {
			draft.groupChatUsersLoading = true;
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
		ChatActions.getGroupChatUsersSuccess,
		produce((draft: FriendsState, { payload }: ReturnType<typeof ChatActions.getGroupChatUsersSuccess>) => {
			draft.usersForSelectedGroupChat = unionBy(draft.usersForSelectedGroupChat, payload.users, 'id');

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
			const { users, hasMore, initializedBySearch } = payload;

			draft.hasMoreFriends = hasMore;

			if (initializedBySearch) {
				draft.loading = false;
				draft.friends = users;

				return draft;
			}

			draft.friends = unionBy(draft.friends, users, 'id');

			return draft;
		}),
	)
	.handleAction(
		ChatActions.addUsersToGroupChatSuccess,
		produce((draft: FriendsState, { payload }: ReturnType<typeof ChatActions.addUsersToGroupChatSuccess>) => {
			const { users } = payload;

			draft.usersForSelectedGroupChat.push(...users);

			return draft;
		}),
	)
	.handleAction(
		FriendActions.addFriendSuccess,
		produce((draft: FriendsState, { payload }: ReturnType<typeof FriendActions.addFriendSuccess>) => {
			draft.friends.push(payload);
			return draft;
		}),
	);

export default friends;
