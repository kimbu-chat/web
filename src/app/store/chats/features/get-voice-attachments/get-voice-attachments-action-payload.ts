import { IPage } from 'app/store/common/models';

export interface IGetVoiceAttachmentsActionPayload {
  chatId: number;
  page: IPage;
}
