import { IPage } from '../common/models';
import { IUserPreview } from '../my-profile/models';

export interface IGetFriendsActionData {
  page: IPage;
  name?: string;
  initializedBySearch?: boolean;
}

export interface IFriendsState {
  loading: boolean;
  friends: IUserPreview[];
  hasMoreFriends: boolean;
}

export interface IGetFriendsSuccessActionData {
  users: Array<IUserPreview>;
  name?: string;
  initializedBySearch?: boolean;
}

export interface IUpdateFriendListActionData {
  phoneNumbers: string[];
}
