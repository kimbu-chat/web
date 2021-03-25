import { IPage } from '../../../../common/models';

export interface IGetPhotoAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
