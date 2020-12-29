import { Page } from 'store/common/models';

export interface GetAudioAttachmentsActionPayload {
  chatId: number;
  page: Page;
}
