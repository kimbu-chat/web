import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

import { Store } from 'redux';
import { getType } from 'typesafe-actions';
import { AuthActions } from 'store/auth/actions';
import { RootState } from 'store/root-reducer';
import { InitSocketConnection } from 'app/store/sockets/features/init-socked-connection/init-socket-connection';
import { EventsNames, EventManager } from './event-manager';
import { MessageCreatedEventHandler } from './integration-event-handlers/message-created-event-handler';
import { UserMessageTypingEventHandler } from './integration-event-handlers/user-message-typing-event-handler';
import { UserStatusChangedEventHandler } from './integration-event-handlers/user-status-changed-event-handler';
import { GroupChatCreatedEventHandler } from './integration-event-handlers/group-chat-created-event-handler';
import { UserMessageReadEventHandler } from './integration-event-handlers/user-message-read-event-handler';
import { IncomingCallEventHandler } from './integration-event-handlers/incoming-call-event-handler';
import { InterlocutorAcceptedCallEventHandler } from './integration-event-handlers/interlocutor-accepted-call-event-handler';
import { CallEndedEventHandler } from './integration-event-handlers/call-ended-event-handler';
import { IceCandidateSentEventHandler } from './integration-event-handlers/ice-candidate-sent-event-handler';
import { MessageEditedEventHandler } from './integration-event-handlers/message-edited-event-handler';
import { MessagesDeletedIntegrationEventHandler } from './integration-event-handlers/messages-deleted-integration-event-handler';
import { ChatClearedIntegrationEventHandler } from './integration-event-handlers/chat-cleared-integration-event-handler';
import { RenegotiationEventHandler } from './integration-event-handlers/renegotiation-event-hander';
import { GroupChatEditedEventHandler } from './integration-event-handlers/group-chat-edited-integration-event-handler';
import { MemberLeftGroupChatEventHandler } from './integration-event-handlers/member-left-group-chat-event-handler';
import { ChatMutedStatusChangedEventHandler } from './integration-event-handlers/chat-mute-status-changed-event-handler';
import { RenegotiationAcceptedEventHandler } from './integration-event-handlers/renegotiation-accepted-event-handler';

let connection: HubConnection;

function openConnection(store: Store<RootState>): void {
  const eventManager = new EventManager();

  // Messages
  eventManager.registerEventHandler(EventsNames.MessageCreated, new MessageCreatedEventHandler());
  eventManager.registerEventHandler(EventsNames.MessageRead, new UserMessageReadEventHandler());
  eventManager.registerEventHandler(EventsNames.MessageEdited, new MessageEditedEventHandler());
  eventManager.registerEventHandler(EventsNames.MessageDeleted, new MessagesDeletedIntegrationEventHandler());
  eventManager.registerEventHandler(EventsNames.MessageTyping, new UserMessageTypingEventHandler());

  // GroupChats
  eventManager.registerEventHandler(EventsNames.GroupChatCreated, new GroupChatCreatedEventHandler());
  eventManager.registerEventHandler(EventsNames.GroupChatEdited, new GroupChatEditedEventHandler());
  eventManager.registerEventHandler(EventsNames.ChatCleared, new ChatClearedIntegrationEventHandler());
  eventManager.registerEventHandler(EventsNames.MemberLeftGroupChat, new MemberLeftGroupChatEventHandler());
  eventManager.registerEventHandler(EventsNames.ChatsMuteStatusChanged, new ChatMutedStatusChangedEventHandler());

  // Friends
  eventManager.registerEventHandler(EventsNames.UserStatusChanged, new UserStatusChangedEventHandler());

  // WebRTC
  eventManager.registerEventHandler(EventsNames.IncomingCall, new IncomingCallEventHandler());
  eventManager.registerEventHandler(EventsNames.CallAccepted, new InterlocutorAcceptedCallEventHandler());
  eventManager.registerEventHandler(EventsNames.CallEnded, new CallEndedEventHandler());
  eventManager.registerEventHandler(EventsNames.IceCandidateSent, new IceCandidateSentEventHandler());
  eventManager.registerEventHandler(EventsNames.RenegotiationSent, new RenegotiationEventHandler());
  eventManager.registerEventHandler(EventsNames.RenegotiationAccepted, new RenegotiationAcceptedEventHandler());

  connection = new HubConnectionBuilder()
    .withUrl(`${process.env.NOTIFICATIONS_API}/signalr`, {
      logMessageContent: true,
      accessTokenFactory: () => store.getState().auth.securityTokens.accessToken,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.None)
    .build();

  connection
    .start()
    .then(() => {
      console.warn('CONNECTED WEBSOCKETS');
    })
    .catch((err: any) => {
      console.warn('ERROR WEBSOCKETS', err);
    });

  connection.on('notify', (event: IIntegrationEvent) => {
    console.warn('Event received. Data: ', event);
    const eventHandler = eventManager.getEventHandler(event.name as EventsNames);
    if (eventHandler) {
      eventHandler!.handle(store, event.object);
    }
  });
  connection.onreconnecting(() => {
    console.warn('RECONNECTING WEBSOCKETS');
  });

  connection.onreconnected(() => {
    console.warn('ON RECCONECTED WEBSOCKETS');
  });

  connection.onclose((err: any) => {
    console.warn('WEB SOCKET CONNECTION WAS LOST', err);
  });
}

export function signalRInvokeMiddleware(store: any): any {
  return (next: any) => async (action: any) => {
    switch (action.type) {
      case getType(InitSocketConnection.action): {
        if (!connection || connection.state === HubConnectionState.Disconnected || connection.state !== HubConnectionState.Connecting) {
          openConnection(store);
        }
        return next(action);
      }
      case getType(AuthActions.logout): {
        if (connection && connection.state === HubConnectionState.Connected) {
          connection.stop();
        }
        return next(action);
      }
      default:
        return next(action);
    }
  };
}
interface IIntegrationEvent {
  name: string;
  object: any;
}
