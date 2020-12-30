import { IUserPreview } from 'app/store/my-profile/models';

export interface IGetFriendsSuccessActionPayload {
  users: Array<IUserPreview>;
  name?: string;
  initializedBySearch?: boolean;
  hasMore: boolean;
}
