import { ParsedInterlocutorId, InterlocutorType, Chat } from './models';

export class ChatService {
	public static getChatIdentifier(userId?: number, groupChatId?: number): number {
		if (userId) {
			return +`${userId}${InterlocutorType.USER}`;
		}
		return +`${groupChatId}${InterlocutorType.GROUP_CHAT}`;
	}

	public static getChatId(interlocutorId?: number, groupChatId?: number): number {
		if (groupChatId) {
			return +`${groupChatId}${InterlocutorType.GROUP_CHAT}`;
		}
		return +`${interlocutorId}${InterlocutorType.USER}`;
	}

	public static parseChatId(chatId: number): ParsedInterlocutorId {
		const interlocutorId = +chatId.toString().substring(0, chatId.toString().length - 1);
		return {
			interlocutorId,
			// last digit stores interlocutor type
			interlocutorType: chatId % 10,
		};
	}

	public static getInterlocutorType(chat: Chat): InterlocutorType {
		if (Boolean(chat.interlocutor)) {
			return InterlocutorType.USER;
		}
		return InterlocutorType.GROUP_CHAT;
	}

	public static getInterlocutorTypeById(chatId: number): InterlocutorType {
		return chatId % 10 === InterlocutorType.USER ? InterlocutorType.USER : InterlocutorType.GROUP_CHAT;
	}
}
