import { IPage } from 'app/store/common/models';

export interface IGetVideoAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
