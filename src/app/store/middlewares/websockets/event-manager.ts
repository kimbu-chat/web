import { IEventHandler } from './event-handler';

export enum EventsNames {
  MESSAGE_CREATED = 'MessageCreated',
  MESSAGE_EDITED = 'MessageEdited',
  MESSAGES_DELETED = 'MessagesDeleted',
  GROUP_CHAT_MESSAGE_CREATED = 'GroupChatMessageCreated',
  USER_STATUS_CHANGED = 'UserStatusChanged',
  GROUP_CHAT_CREATED = 'GroupChatCreated',
  MESSAGES_READ = 'MessagesRead',
  INTEROCUTOR_MESSAGE_TYPING = 'MessageTyping',
  CHAT_CLEARED = 'ClearChat',
  // Event names for WEBRTC
  INCOMING_CALL = 'CallInit',
  INTERLOCUTOR_ACCEPTED_CALL = 'CallAccepted',
  INTERLOCUTOR_CANCELED_CALL = 'CallCancelled',
  CALL_NOT_ANSWERED = 'CallNotAnswered',
  CALL_ENDED = 'CallEnded',
  BUSY_CALL = 'CallBusy',
  CANDIDATE = 'Candidate',
}

export class EventManager {
  private intergrationEventHandlers = new Map<EventsNames, IEventHandler>();

  public registerEventHandler(eventName: EventsNames, eventHandler: IEventHandler): void {
    this.intergrationEventHandlers.set(eventName, eventHandler);
  }

  public getEventHandler(eventName: EventsNames): IEventHandler | null {
    const eventHandler = this.intergrationEventHandlers.get(eventName);

    if (!eventHandler) {
      return null;
    }

    return eventHandler as IEventHandler;
  }
}
