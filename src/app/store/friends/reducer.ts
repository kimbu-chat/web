import produce from 'immer';
import { UserPreview } from '../contacts/types';
import { FriendsActions } from './actions';
import { FriendsActionTypes } from './types';
import { DialogsActionTypes } from '../dialogs/types';
import _ from 'lodash';

export interface FriendsState {
  loading: boolean;
  friends: UserPreview[];
  userIdsToAddIntoConference: number[];
  userIdsForSelectedConference: (number | undefined)[];
  conferenceUsersLoading: boolean;
}

const initialState: FriendsState = {
  loading: true,
  friends: [],
  userIdsForSelectedConference: [],
  userIdsToAddIntoConference: [],
  conferenceUsersLoading: false
};

const checkUserExist = (userId: number, state: FriendsState): boolean => {
  return Boolean(state.friends.find(({ id }) => id === userId));
};

const findUserIndex = (userId: number, state: FriendsState): number => {
  return state.friends.findIndex(({ id }) => id === userId);
};

const friends = produce(
  (draft: FriendsState = initialState, action: ReturnType<FriendsActions>): FriendsState => {
    switch (action.type) {
      case FriendsActionTypes.UNSET_SELECTED_USER_IDS_TO_ADD_INTO_CONFERENCE: {
        for (const userId of draft.userIdsToAddIntoConference) {
          const userIndex = findUserIndex(userId, draft);
          if (draft.friends[userIndex]) draft.friends[userIndex].supposedToAddIntoConference = false;
        }

        draft.userIdsToAddIntoConference = [];

        return draft;
      }
      case DialogsActionTypes.GET_CONFERENCE_USERS: {
        draft.conferenceUsersLoading = true;

        return draft;
      }

      case DialogsActionTypes.UNSET_CONFERENCE_USERS: {
        draft.userIdsForSelectedConference = [];

        return draft;
      }

      case DialogsActionTypes.USER_STATUS_CHANGED_EVENT: {
        const userId = action.payload.objectId;
        const isUserExist = checkUserExist(userId, draft);

        if (!isUserExist) {
          return draft;
        }

        const userIndex = findUserIndex(userId, draft);

        draft.friends[userIndex].status = action.payload.status;
        draft.friends[userIndex].lastOnlineTime = new Date();

        return draft;
      }

      case DialogsActionTypes.GET_CONFERENCE_USERS_SUCCESS: {
        (draft.conferenceUsersLoading = false), (draft.userIdsForSelectedConference = action.payload.map((x) => x.id));

        return draft;
      }

      case FriendsActionTypes.MARK_USER_AS_ADDED_TO_CONFERENCE: {
        const userId: number = action.payload;
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
      }

      case FriendsActionTypes.GET_FRIENDS: {
        draft.loading = true;
        return draft;
      }

      case FriendsActionTypes.DELETE_FRIEND_SUCCESS: {
        draft.friends = draft.friends.filter(({ id }) => id != action.payload);

        return draft;
      }

      case FriendsActionTypes.GET_FRIENDS_SUCCESS: {
        const { users, initializedBySearch } = action.payload;

        if (initializedBySearch) {
          draft.loading = false;
          draft.friends = users;

          return draft;
        }

        draft.friends = _.unionBy(draft.friends, users, 'id');

        return draft;
      }

      default:
        return draft;
    }
  }
);

export default friends;
