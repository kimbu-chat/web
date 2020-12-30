import { IMessage } from '../../models';

export interface ICreateMessageActionPayload {
  chatId: number;
  message: IMessage;
  isFromEvent?: boolean;
  currentUserId?: number;
}
