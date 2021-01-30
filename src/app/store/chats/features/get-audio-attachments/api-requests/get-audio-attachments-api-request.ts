import { IPage } from 'app/store/common/models';

export interface IGetAudioAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
