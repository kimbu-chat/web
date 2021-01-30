import { IPage } from 'app/store/common/models';

export interface IGetPhotoAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
