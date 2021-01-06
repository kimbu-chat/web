import { IPage } from 'app/store/models';

export interface IGetGroupChatUsersActionPayload {
  page: IPage;
  isFromSearch: boolean;
  name?: string;
}
