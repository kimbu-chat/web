import { ChatIdDetails } from './chat-id-details';
import { InterlocutorType } from './models';

export class ChatId {
  public static from(userId?: string, groupChatId?: string): ChatIdDetails {
    if (typeof userId === 'string' && userId) {
      const id = `${userId}${InterlocutorType.User}`;
      return new ChatIdDetails(id, userId, InterlocutorType.User, userId, null);
    }
    if (typeof groupChatId === 'string' && groupChatId) {
      const id = `${groupChatId}${InterlocutorType.GroupChat}`;
      return new ChatIdDetails(id, groupChatId, InterlocutorType.GroupChat, null, groupChatId);
    }
    throw new Error(`Invalid params: userId = ${userId}, groupChatId = ${groupChatId}`);
  }

  public static fromId(chatId: string): ChatIdDetails {
    // last digit stores interlocutor type
    const interlocutorId = chatId.substring(0, chatId.length - 1);
    const interlocutorType: InterlocutorType = +chatId.charAt(chatId.length - 1);

    if (interlocutorType === InterlocutorType.User) {
      return new ChatIdDetails(chatId, interlocutorId, InterlocutorType.User, interlocutorId, null);
    }
    if (interlocutorType === InterlocutorType.GroupChat) {
      return new ChatIdDetails(
        chatId,
        interlocutorId,
        InterlocutorType.GroupChat,
        null,
        interlocutorId,
      );
    }
    throw new Error(`Unknown interlocutorType: chatId = ${chatId}`);
  }
}
