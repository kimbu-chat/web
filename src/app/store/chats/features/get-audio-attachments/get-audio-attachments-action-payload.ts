import { Page } from '../../../common/models';

export interface GetAudioAttachmentsActionPayload {
  chatId: number;
  page: Page;
}
