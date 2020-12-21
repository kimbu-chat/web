import { InterlocutorType } from './models';

export class ChatIdDetails {
  public readonly id: number;

  public readonly interlocutorId: number;

  public readonly interlocutorType: InterlocutorType;

  public readonly userId: number | null;

  public readonly groupChatId: number | null;

  constructor(id: number, interlocutorId: number, interlocutorType: InterlocutorType, userId: number | null, groupChatId: number | null) {
    this.id = id;
    this.interlocutorId = interlocutorId;
    this.interlocutorType = interlocutorType;
    this.userId = userId;
    this.groupChatId = groupChatId;
  }
}

export class ChatId {
  public static from(userId?: number, groupChatId?: number): ChatIdDetails {
    if (userId && !Number.isNaN(userId)) {
      const id: number = +`${userId}${InterlocutorType.USER}`;
      return new ChatIdDetails(id, userId, InterlocutorType.USER, userId, null);
    }
    if (groupChatId && !Number.isNaN(groupChatId)) {
      const id: number = +`${groupChatId}${InterlocutorType.GROUP_CHAT}`;
      console.log(id);
      return new ChatIdDetails(id, groupChatId, InterlocutorType.GROUP_CHAT, null, groupChatId);
    }
    throw new Error(`Invalid params: userId = ${userId}, groupChatId = ${groupChatId}`);
  }

  public static fromId(chatId: number): ChatIdDetails {
    // last digit stores interlocutor type
    const interlocutorId = +chatId.toString().substring(0, chatId.toString().length - 1);
    const interlocutorType: InterlocutorType = chatId % 10;

    if (interlocutorType === InterlocutorType.USER) {
      return new ChatIdDetails(chatId, interlocutorId, InterlocutorType.USER, interlocutorId, null);
    }
    if (interlocutorType === InterlocutorType.GROUP_CHAT) {
      return new ChatIdDetails(chatId, interlocutorId, InterlocutorType.GROUP_CHAT, null, interlocutorId);
    }
    throw new Error(`Unknown interlocutorType: chatId = ${chatId}`);
  }
}
