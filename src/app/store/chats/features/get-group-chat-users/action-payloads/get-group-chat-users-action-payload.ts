import { IPage } from '../../../../common/models';

export interface IGetGroupChatUsersActionPayload {
  page: IPage;
  isFromSearch: boolean;
  name?: string;
}
