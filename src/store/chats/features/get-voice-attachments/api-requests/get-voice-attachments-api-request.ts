import { IPage } from '../../../../common/models';

export interface IGetVoiceAttachmentsApiRequest {
  page: IPage;
  chatId: number;
}
