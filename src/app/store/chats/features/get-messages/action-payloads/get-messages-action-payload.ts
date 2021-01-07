import { IPage } from 'app/store/models';

export interface IGetMessagesActionPayload {
  page: IPage;
  isFromSearch?: boolean;
  searchString?: string;
}
