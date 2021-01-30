import { IPage } from 'app/store/common/models';

export interface IGetGroupChatUsersActionPayload {
  page: IPage;
  isFromSearch: boolean;
  name?: string;
}
