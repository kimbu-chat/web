import { IPage } from 'app/store/models';

export interface IGetAudioAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
