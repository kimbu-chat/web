import { IPage } from '../../../../common/models';

export interface IGetVideoAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
