import { IEventHandler } from './event-handler';

export enum EVENTS_NAMES {
	MESSAGE_CREATED = 'MessageCreated',
	CONFERENCE_MESSAGE_CREATED = 'ConferenceMessageCreated',
	USER_STATUS_CHANGED = 'UserStatusChanged',
	CONFERENCE_CREATED = 'ConferenceCreated',
	CONFERENCE_MESSAGE_READ = 'ConferenceMessagesRead',
	USER_MESSAGE_READ = 'UserMessagesRead',
	INTEROCUTOR_MESSAGE_TYPING = 'MessageTyping',
	//Event names for WEBRTC
	INCOMING_CALL = 'IncomingCall',
	INTERLOCUTOR_ACCEPTED_CALL = 'CallAccepted',
	INTERLOCUTOR_CANCELED_CALL = 'CallDeclined',
	CALL_ENDED = 'CallEnded',
	CANDIDATE = 'Candidate',
}

export class EventManager {
	private intergrationEventHandlers = new Map<EVENTS_NAMES, IEventHandler>();

	public registerEventHandler(eventName: EVENTS_NAMES, eventHandler: IEventHandler): void {
		this.intergrationEventHandlers.set(eventName, eventHandler);
	}

	public getEventHandler(eventName: EVENTS_NAMES): IEventHandler {
		const eventHandler = this.intergrationEventHandlers.get(eventName);

		if (!eventHandler) {
			alert('Event handler not found');
		}

		return this.intergrationEventHandlers.get(eventName) as IEventHandler;
	}
}
