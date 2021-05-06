import { IPage } from '../../../../common/models';

export interface IGetMessagesActionPayload {
  page: IPage;
  isFromScroll?: boolean;
  searchString?: string;
}
