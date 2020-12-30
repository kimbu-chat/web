import { IPage } from 'app/store/common/models';

export interface IGetChatsActionPayload {
  page: IPage;
  showOnlyHidden: boolean;
  showAll: boolean;
  initializedBySearch: boolean;
  name?: string;
}
