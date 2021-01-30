import { IPage } from 'app/store/common/models';

export interface IGetVoiceAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
