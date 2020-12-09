import { Page } from 'app/store/common/models';

export interface GetPhotoAttachmentsActionPayload {
  chatId: number;
  page: Page;
}
