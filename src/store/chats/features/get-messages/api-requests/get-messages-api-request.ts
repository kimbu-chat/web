import { IPage } from '../../../../common/models';

export interface IGetMessagesApiRequest {
  page: IPage;
  chatId: number;
  searchString?: string;
}
