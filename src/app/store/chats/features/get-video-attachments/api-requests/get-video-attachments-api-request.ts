import { IPage } from 'app/store/models';

export interface IGetVideoAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
