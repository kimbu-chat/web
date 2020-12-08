import { Page } from 'app/store/common/models';

export interface GetVideoAttachmentsActionPayload {
  chatId: number;
  page: Page;
}
