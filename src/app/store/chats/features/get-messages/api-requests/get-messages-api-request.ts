import { IPage } from 'app/store/models';

export interface IGetMessagesApiRequest {
  page: IPage;
  chatId: number;
  searchString?: string;
}
