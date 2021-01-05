import { IUserPreview } from 'app/store/models';

export interface IGetFriendsSuccessActionPayload {
  users: Array<IUserPreview>;
  name?: string;
  initializedBySearch?: boolean;
  hasMore: boolean;
}
