import { ParsedInterlocutorId, InterlocutorType, Chat } from './models';

export class ChatService {
	public static getChatIdentifier(userId?: number | null, conferenceId?: number | null): number {
		if (userId) {
			return +`${userId}${InterlocutorType.USER}`;
		}
		return +`${conferenceId}${InterlocutorType.CONFERENCE}`;
	}

	public static getChatId(interlocutorId: number | null, conferenceId: number | null): number {
		if (conferenceId) {
			return +`${conferenceId}${InterlocutorType.CONFERENCE}`;
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
		return InterlocutorType.CONFERENCE;
	}
}
