import { IEventHandler } from './event-handler';

export enum EventsNames {
  // Messages
  MESSAGE_CREATED = 'MessageCreated',
  MESSAGE_EDITED = 'MessageEdited',
  MESSAGES_DELETED = 'MessagesDeleted',
  MESSAGES_READ = 'MessagesRead',
  INTEROCUTOR_MESSAGE_TYPING = 'MessageTyping',

  // GroupChats
  GROUP_CHAT_CREATED = 'GroupChatCreated',
  GROUP_CHAT_EDITED = 'GroupChatEdited',
  CHAT_CLEARED = 'ClearChat',
  MEMBER_LEFT_GROUP_CHAT = 'MemberLeftGroupChat',
  CHAT_MUTE_STATUS_CHANGED = 'ChatsMuteStatusChanged',

  // Friends
  USER_STATUS_CHANGED = 'UserStatusChanged',

  // WebRTC
  INCOMING_CALL = 'CallOfferSent',
  RENEGOTIATION_SENT = 'RenegotiationSent',
  INTERLOCUTOR_ACCEPTED_CALL = 'CallAccepted',
  CALL_ENDED = 'CallEnded',
  ICE_CANDIDATE_SENT = 'IceCandidateSent',
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
