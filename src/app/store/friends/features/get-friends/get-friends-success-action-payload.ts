import { UserPreview } from 'app/store/my-profile/models';

export interface GetFriendsSuccessActionPayload {
  users: Array<UserPreview>;
  name?: string;
  initializedBySearch?: boolean;
  hasMore: boolean;
}
