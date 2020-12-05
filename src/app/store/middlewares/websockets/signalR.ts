import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

import { Store } from 'redux';
import { getType } from 'typesafe-actions';
import { AuthActions } from 'store/auth/actions';
import { RootState } from 'store/root-reducer';
import { ApiBasePath } from 'store/root-api';
import { InitSocketConnection } from 'app/store/sockets/features/init-socked-connection/init-socket-connection';
import { EventsNames, EventManager } from './event-manager';
import { MessageCreatedEventHandler } from './integration-event-handlers/message-created-event-handler';
import { UserMessageTypingEventHandler } from './integration-event-handlers/user-message-typing-event-handler';
import { UserStatusChangedEventHandler } from './integration-event-handlers/user-status-changed-event-handler';
import { GroupChatCreatedEventHandler } from './integration-event-handlers/group-chat-created-event-handler';
import { UserMessageReadEventHandler } from './integration-event-handlers/user-message-read-event-handler';
import { IncomingCallEventHandler } from './integration-event-handlers/incoming-call-event-handler';
import { InterlocutorAcceptedCallEventHandler } from './integration-event-handlers/interlocutor-accepted-call-event-handler';
import { InterlocutorCanceledCallEventHandler } from './integration-event-handlers/interlocutor-canceled-call-event-handler';
import { CallEndedEventHandler } from './integration-event-handlers/call-ended-event-handler';
import { CandidateEventHandler } from './integration-event-handlers/candidate-event-handler';
import { BusyCallEvenHandler } from './integration-event-handlers/busy-call-event-handler';
import { MessageEditedEventHandler } from './integration-event-handlers/message-edited-event-handler';

let connection: HubConnection;

function openConnection(store: Store<RootState>): void {
  const eventManager = new EventManager();
  eventManager.registerEventHandler(EventsNames.MESSAGE_CREATED, new MessageCreatedEventHandler());
  eventManager.registerEventHandler(EventsNames.INTEROCUTOR_MESSAGE_TYPING, new UserMessageTypingEventHandler());
  eventManager.registerEventHandler(EventsNames.USER_STATUS_CHANGED, new UserStatusChangedEventHandler());
  eventManager.registerEventHandler(EventsNames.GROUP_CHAT_CREATED, new GroupChatCreatedEventHandler());
  eventManager.registerEventHandler(EventsNames.MESSAGES_READ, new UserMessageReadEventHandler());
  // WebRTC
  eventManager.registerEventHandler(EventsNames.INCOMING_CALL, new IncomingCallEventHandler());
  eventManager.registerEventHandler(EventsNames.INTERLOCUTOR_ACCEPTED_CALL, new InterlocutorAcceptedCallEventHandler());
  eventManager.registerEventHandler(EventsNames.INTERLOCUTOR_CANCELED_CALL, new InterlocutorCanceledCallEventHandler());
  eventManager.registerEventHandler(EventsNames.CALL_NOT_ANSWERED, new InterlocutorCanceledCallEventHandler());
  eventManager.registerEventHandler(EventsNames.CALL_ENDED, new CallEndedEventHandler());
  eventManager.registerEventHandler(EventsNames.CANDIDATE, new CandidateEventHandler());
  eventManager.registerEventHandler(EventsNames.BUSY_CALL, new BusyCallEvenHandler());
  eventManager.registerEventHandler(EventsNames.MESSAGE_EDITED, new MessageEditedEventHandler());

  connection = new HubConnectionBuilder()
    .withUrl(`${ApiBasePath.NotificationsApi}/signalr`, {
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
