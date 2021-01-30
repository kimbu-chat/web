import { IPage } from 'app/store/common/models';

export interface IGetRawAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
