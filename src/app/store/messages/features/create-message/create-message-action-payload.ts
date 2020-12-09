import { Message } from '../../models';

export interface CreateMessageActionPayload {
  chatId: number;
  message: Message;
  isFromEvent?: boolean;
  currentUserId?: number;
}
