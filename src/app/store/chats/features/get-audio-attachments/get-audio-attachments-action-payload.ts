import { IPage } from 'store/common/models';

export interface IGetAudioAttachmentsActionPayload {
  chatId: number;
  page: IPage;
}
