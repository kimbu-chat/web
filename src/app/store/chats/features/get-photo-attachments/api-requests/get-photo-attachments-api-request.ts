import { IPage } from 'app/store/models';

export interface IGetPhotoAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
