import { IPage } from 'app/store/models';

export interface IGetChatsActionPayload {
  page: IPage;
  showOnlyHidden: boolean;
  showAll: boolean;
  initializedByScroll: boolean;
  name?: string;
}
