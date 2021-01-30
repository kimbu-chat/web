import { IPage } from 'app/store/common/models';

export interface IGetMessagesApiRequest {
  page: IPage;
  chatId: number;
  searchString?: string;
}
