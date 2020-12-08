import { Page } from 'app/store/common/models';

export interface GetVoiceAttachmentsActionPayload {
  chatId: number;
  page: Page;
}
