import { Page } from 'app/store/common/models';

export interface GetFriendsActionPayload {
  page: Page;
  name?: string;
  initializedBySearch?: boolean;
}
