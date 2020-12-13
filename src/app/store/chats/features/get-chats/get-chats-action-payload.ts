import { Page } from 'app/store/common/models';

export interface GetChatsActionPayload {
  page: Page;
  showOnlyHidden: boolean;
  showAll: boolean;
  initializedBySearch: boolean;
  name?: string;
}
