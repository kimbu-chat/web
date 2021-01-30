import { IPage } from 'app/store/common/models';

export interface IGetMessagesActionPayload {
  page: IPage;
  isFromSearch?: boolean;
  searchString?: string;
}
