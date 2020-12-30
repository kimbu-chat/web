import { IPage } from 'app/store/common/models';

export interface IGetPhotoAttachmentsActionPayload {
  chatId: number;
  page: IPage;
}
