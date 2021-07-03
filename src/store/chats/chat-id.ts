import { ChatIdDetails } from './chat-id-details';
import { InterlocutorType } from './models';

export class ChatId {
  public static from(userId?: number, groupChatId?: number): ChatIdDetails {
    if (userId && !Number.isNaN(userId)) {
      const id: number = +`${userId}${InterlocutorType.User}`;
      return new ChatIdDetails(id, userId, InterlocutorType.User, userId, null);
    }
    if (groupChatId && !Number.isNaN(groupChatId)) {
      const id: number = +`${groupChatId}${InterlocutorType.GroupChat}`;
      return new ChatIdDetails(id, groupChatId, InterlocutorType.GroupChat, null, groupChatId);
    }
    throw new Error(`Invalid params: userId = ${userId}, groupChatId = ${groupChatId}`);
  }

  public static fromId(chatId: number): ChatIdDetails {
    // last digit stores interlocutor type
    const interlocutorId = +chatId.toString().substring(0, chatId.toString().length - 1);
    const interlocutorType: InterlocutorType = chatId % 10;

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
