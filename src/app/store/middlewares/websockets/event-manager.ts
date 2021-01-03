import { IEventHandler } from './event-handler';

export enum EventsNames {
  // Messages
  MessageCreated = 'MessageCreated',
  MessageEdited = 'MessageEdited',
  MessageDeleted = 'MessagesDeleted',
  MessageRead = 'MessagesRead',
  MessageTyping = 'MessageTyping',

  // GroupChats
  GroupChatCreated = 'GroupChatCreated',
  GroupChatEdited = 'GroupChatEdited',
  ChatCleared = 'ChatCleared',
  MemberLeftGroupChat = 'MemberLeftGroupChat',
  ChatsMuteStatusChanged = 'ChatsMuteStatusChanged',

  // Friends
  UserStatusChanged = 'UserStatusChanged',

  // WebRTC
  IncomingCall = 'CallOfferSent',
  RenegotiationSent = 'RenegotiationSent',
  CallAccepted = 'CallAccepted',
  CallEnded = 'CallEnded',
  IceCandidateSent = 'IceCandidateSent',
  RenegotiationAccepted = 'RenegotiationAccepted',
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
