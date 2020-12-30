import { IPage } from 'app/store/common/models';

export interface IGetVideoAttachmentsActionPayload {
  chatId: number;
  page: IPage;
}
