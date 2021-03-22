import { IPage } from '../../../../common/models';

export interface IGetRawAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
