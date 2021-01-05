import { IUserPreview } from 'app/store/models';

export interface IFriendsState {
  loading: boolean;
  friends: IUserPreview[];
  hasMoreFriends: boolean;
}
