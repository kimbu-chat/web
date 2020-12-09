import { BaseAttachment } from 'app/store/chats/models';
import { MessageState } from '../../models';

export interface CreateMessageSuccessActionPayload {
  oldMessageId: number;
  newMessageId: number;
  messageState: MessageState;
  attachments?: BaseAttachment[];
  chatId: number;
}
