import { IPage } from '../../../../common/models';

export interface IGetChatsApiRequest {
  page: IPage;
  showOnlyHidden: boolean;
  showAll: boolean;
  initializedBySearch?: boolean;
  name?: string;
}
