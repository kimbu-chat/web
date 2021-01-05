import { IPage } from 'app/store/models';

export interface IGetVoiceAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
