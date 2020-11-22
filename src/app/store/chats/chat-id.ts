import { InterlocutorType } from './models';

export class ChatId {
	public get interlocutorId(): number {
		this.CheckIfChatIdIsInitialized();
		// last digit stores interlocutor type
		return +this.chatId.toString().substring(0, this.chatId.toString().length - 1);
	}

	public get entireId(): number {
		this.CheckIfChatIdIsInitialized();
		return this.chatId;
	}

	public get interlocutorType(): InterlocutorType {
		this.CheckIfChatIdIsInitialized();
		// last digit stores interlocutor type
		return this.chatId % 10;
	}

	public get userId(): number | null {
		this.CheckIfChatIdIsInitialized();
		return this.interlocutorType == InterlocutorType.USER ? this.interlocutorId : null;
	}

	public get groupChatId(): number | null {
		this.CheckIfChatIdIsInitialized();
		return this.interlocutorType == InterlocutorType.GROUP_CHAT ? this.interlocutorId : null;
	}

	public From(userId?: number, groupChatId?: number): ChatId {
		if (userId && !isNaN(userId)) {
			this.chatId = +`${userId}${InterlocutorType.USER}`;
			return this;
		} else if (groupChatId && !isNaN(groupChatId)) {
			this.chatId = +`${groupChatId}${InterlocutorType.GROUP_CHAT}`;
			return this;
		} else {
			throw new Error('Params are invalid');
		}
	}

	public FromId(chatId: number) {
		this.chatId = chatId;
		return this;
	}

	private chatId: number = 0;

	public CheckIfChatIdIsInitialized() {
		if (this.chatId === 0) {
			throw new Error('ChatId is not initialized');
		}
	}
}
