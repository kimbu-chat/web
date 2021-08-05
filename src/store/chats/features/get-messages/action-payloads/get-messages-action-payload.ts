import { IPaginationParams } from 'kimbu-models';

export interface IGetMessagesActionPayload {
  page: IPaginationParams;
  isFromScroll?: boolean;
  searchString?: string;
}
