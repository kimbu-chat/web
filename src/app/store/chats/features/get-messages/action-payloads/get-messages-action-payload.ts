import { IPage } from '../../../../common/models';

export interface IGetMessagesActionPayload {
  page: IPage;
  isFromSearch?: boolean;
  searchString?: string;
}
