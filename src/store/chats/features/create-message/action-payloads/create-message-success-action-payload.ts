import { MessageState, IBaseAttachment } from '../../../models';

export interface ICreateMessageSuccessActionPayload {
  oldMessageId: number;
  newMessageId: number;
  messageState: MessageState;
  attachments?: IBaseAttachment[];
  chatId: number;
}
