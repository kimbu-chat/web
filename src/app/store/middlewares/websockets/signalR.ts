import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

import { EVENTS_NAMES, EventManager } from './event-manager';
import { Store } from 'redux';
import { MessageCreatedEventHandler } from './integration-event-handlers/message-created-event-handler';
import { UserMessageTypingEventHandler } from './integration-event-handlers/user-message-typing-event-handler';
import { UserStatusChangedEventHandler } from './integration-event-handlers/user-status-changed-event-handler';
import { ConferenceCreatedEventHandler } from './integration-event-handlers/conference-created-event-handler';
import { ConferenceMessageReadEventHandler } from './integration-event-handlers/conference-message-read-event-handler';
import { UserMessageReadEventHandler } from './integration-event-handlers/user-message-read-event-handler';
import { getType } from 'typesafe-actions';
import { AuthActions } from 'app/store/auth/actions';
import { RootState } from 'app/store/root-reducer';
import { WebSocketActions } from 'app/store/sockets/actions';
import { IncomingCallEventHandler } from './integration-event-handlers/incoming-call';
import { InterlocutorAcceptedCallEventHandler } from './integration-event-handlers/interlocutor-accepted-call';
import { InterlocutorCanceledCallEventHandler } from './integration-event-handlers/interlocutor-canceled-call';
import { CallEndedEventHandler } from './integration-event-handlers/call-ended';
import { CandidateEventHandler } from './integration-event-handlers/candidate-event-handler';
import { ApiBasePath } from 'app/store/root-api';

let connection: HubConnection | null = null;

export function signalRInvokeMiddleware(store: any): any {
	return (next: any) => async (action: any) => {
		switch (action.type) {
			case getType(WebSocketActions.initSocketConnection): {
				if (
					!connection ||
					connection.state === HubConnectionState.Disconnected ||
					connection.state !== HubConnectionState.Connecting
				) {
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

function openConnection(store: Store<RootState>): void {
	const eventManager = new EventManager();
	eventManager.registerEventHandler(EVENTS_NAMES.MESSAGE_CREATED, new MessageCreatedEventHandler());
	eventManager.registerEventHandler(EVENTS_NAMES.INTEROCUTOR_MESSAGE_TYPING, new UserMessageTypingEventHandler());
	eventManager.registerEventHandler(EVENTS_NAMES.USER_STATUS_CHANGED, new UserStatusChangedEventHandler());
	eventManager.registerEventHandler(EVENTS_NAMES.CONFERENCE_CREATED, new ConferenceCreatedEventHandler());
	eventManager.registerEventHandler(EVENTS_NAMES.CONFERENCE_MESSAGE_READ, new ConferenceMessageReadEventHandler());
	eventManager.registerEventHandler(EVENTS_NAMES.USER_MESSAGE_READ, new UserMessageReadEventHandler());
	//WebRTC
	eventManager.registerEventHandler(EVENTS_NAMES.INCOMING_CALL, new IncomingCallEventHandler());
	eventManager.registerEventHandler(
		EVENTS_NAMES.INTERLOCUTOR_ACCEPTED_CALL,
		new InterlocutorAcceptedCallEventHandler(),
	);
	eventManager.registerEventHandler(
		EVENTS_NAMES.INTERLOCUTOR_CANCELED_CALL,
		new InterlocutorCanceledCallEventHandler(),
	);
	eventManager.registerEventHandler(EVENTS_NAMES.CALL_ENDED, new CallEndedEventHandler());
	eventManager.registerEventHandler(EVENTS_NAMES.CANDIDATE, new CandidateEventHandler());

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
		console.warn('connection.on(EVENTS_NAMES.NOTIFY');
		const eventHandler = eventManager.getEventHandler(event.name as EVENTS_NAMES);
		eventHandler.handle(store, event.object);
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

interface IntegrationEvent {
	name: string;
	object: any;
}
