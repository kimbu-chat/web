import { IPage } from 'app/store/common/models';

export interface IGetRawAttachmentsActionPayload {
  chatId: number;
  page: IPage;
}
