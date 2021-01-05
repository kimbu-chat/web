import { IUserPreview } from '../../my-profile/models';

export interface IFriendsState {
  loading: boolean;
  friends: IUserPreview[];
  hasMoreFriends: boolean;
}
