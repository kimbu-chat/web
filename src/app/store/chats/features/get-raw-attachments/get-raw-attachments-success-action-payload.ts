import { FilesList } from '../../models';

export interface GetRawAttachmentsSuccessActionPayload extends FilesList {
  chatId: number;
}
