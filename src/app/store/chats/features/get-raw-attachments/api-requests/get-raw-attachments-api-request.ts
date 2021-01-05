import { IPage } from 'app/store/models';

export interface IGetRawAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
