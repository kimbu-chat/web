import { IEventHandler } from './event-handler';

export enum EVENTS_NAMES {
	MESSAGE_CREATED = 'MessageCreated',
	GROUP_CHAT_MESSAGE_CREATED = 'GroupChatMessageCreated',
	USER_STATUS_CHANGED = 'UserStatusChanged',
	GROUP_CHAT_CREATED = 'GroupChatCreated',
	MESSAGES_READ = 'MessagesRead',
	INTEROCUTOR_MESSAGE_TYPING = 'MessageTyping',
	//Event names for WEBRTC
	INCOMING_CALL = 'CallInit',
	INTERLOCUTOR_ACCEPTED_CALL = 'CallAccepted',
	INTERLOCUTOR_CANCELED_CALL = 'CallCancelled',
	CALL_NOT_ANSWERED = 'CallNotAnswered',
	CALL_ENDED = 'CallEnded',
	CANDIDATE = 'Candidate',
}

export class EventManager {
	private intergrationEventHandlers = new Map<EVENTS_NAMES, IEventHandler>();

	public registerEventHandler(eventName: EVENTS_NAMES, eventHandler: IEventHandler): void {
		this.intergrationEventHandlers.set(eventName, eventHandler);
	}

	public getEventHandler(eventName: EVENTS_NAMES): IEventHandler | null {
		const eventHandler = this.intergrationEventHandlers.get(eventName);

		if (!eventHandler) {
			return null;
		}

		return eventHandler as IEventHandler;
	}
}
