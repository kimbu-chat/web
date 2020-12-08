import { Page } from 'app/store/common/models';

export interface GetRawAttachmentsActionPayload {
  chatId: number;
  page: Page;
}
