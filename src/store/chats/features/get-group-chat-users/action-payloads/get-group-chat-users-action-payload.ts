import { IPaginationParams } from 'kimbu-models';

export interface IGetGroupChatUsersActionPayload {
  page: IPaginationParams;
  isFromSearch: boolean;
  name?: string;
}
