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
  eventManager.registerEventHandler(EventsNames.MESSAGE_CREATED, new MessageCreatedEventHandler());
  eventManager.registerEventHandler(EventsNames.MESSAGES_READ, new UserMessageReadEventHandler());
  eventManager.registerEventHandler(EventsNames.MESSAGE_EDITED, new MessageEditedEventHandler());
  eventManager.registerEventHandler(EventsNames.MESSAGES_DELETED, new MessagesDeletedIntegrationEventHandler());
  eventManager.registerEventHandler(EventsNames.INTEROCUTOR_MESSAGE_TYPING, new UserMessageTypingEventHandler());

  // GroupChats
  eventManager.registerEventHandler(EventsNames.GROUP_CHAT_CREATED, new GroupChatCreatedEventHandler());
  eventManager.registerEventHandler(EventsNames.GROUP_CHAT_EDITED, new GroupChatEditedEventHandler());
  eventManager.registerEventHandler(EventsNames.CHAT_CLEARED, new ChatClearedIntegrationEventHandler());
  eventManager.registerEventHandler(EventsNames.MEMBER_LEFT_GROUP_CHAT, new MemberLeftGroupChatEventHandler());
  eventManager.registerEventHandler(EventsNames.CHAT_MUTE_STATUS_CHANGED, new ChatMutedStatusChangedEventHandler());

  // Friends
  eventManager.registerEventHandler(EventsNames.USER_STATUS_CHANGED, new UserStatusChangedEventHandler());

  // WebRTC
  eventManager.registerEventHandler(EventsNames.INCOMING_CALL, new IncomingCallEventHandler());
  eventManager.registerEventHandler(EventsNames.INTERLOCUTOR_ACCEPTED_CALL, new InterlocutorAcceptedCallEventHandler());
  eventManager.registerEventHandler(EventsNames.CALL_ENDED, new CallEndedEventHandler());
  eventManager.registerEventHandler(EventsNames.ICE_CANDIDATE_SENT, new IceCandidateSentEventHandler());
  eventManager.registerEventHandler(EventsNames.RENEGOTIATION_SENT, new RenegotiationEventHandler());
  eventManager.registerEventHandler(EventsNames.RENEGOTIATION_ACCEPTED, new RenegotiationAcceptedEventHandler());

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

  connection.on('notify', (event: IntegrationEvent) => {
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
interface IntegrationEvent {
  name: string;
  object: any;
}
