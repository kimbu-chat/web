import { Page } from 'app/store/common/models';

export interface GetChatsActionPayload {
  page: Page;
  unreadOnly?: boolean;
  showOnlyHidden: boolean;
  showAll: boolean;
  initializedBySearch: boolean;
  name?: string;
}
