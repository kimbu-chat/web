import { Page } from '../common/models';
import { UserPreview } from '../my-profile/models';

export interface GetFriendsActionData {
  page: Page;
  name?: string;
  initializedBySearch?: boolean;
}

export interface FriendsState {
  loading: boolean;
  friends: UserPreview[];
  hasMoreFriends: boolean;
}

export interface GetFriendsSuccessActionData {
  users: Array<UserPreview>;
  name?: string;
  initializedBySearch?: boolean;
}

export interface UpdateFriendListActionData {
  phoneNumbers: string[];
}
