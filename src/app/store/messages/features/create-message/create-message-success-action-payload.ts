import { IBaseAttachment } from 'app/store/chats/models';
import { MessageState } from '../../models';

export interface ICreateMessageSuccessActionPayload {
  oldMessageId: number;
  newMessageId: number;
  messageState: MessageState;
  attachments?: IBaseAttachment[];
  chatId: number;
}
