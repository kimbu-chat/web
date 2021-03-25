import { IPage } from '../../../../common/models';

export interface IGetAudioAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
