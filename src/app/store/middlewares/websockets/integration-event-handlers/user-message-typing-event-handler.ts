import { IntercolutorMessageTypingIntegrationEvent } from '../integration-events/interlocutor-message-typing-integration-event';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'app/store/root-reducer';
import { ChatActions } from 'app/store/dialogs/actions';

export class UserMessageTypingEventHandler implements IEventHandler<IntercolutorMessageTypingIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: IntercolutorMessageTypingIntegrationEvent): void {
		eventData.timeoutId = (setTimeout(() => {
			store.dispatch(ChatActions.interlocutorStoppedTyping(eventData));
		}, 1500) as unknown) as NodeJS.Timeout;

		if (eventData.isConference && eventData.objectId === store.getState().myProfile.user?.id) {
			return;
		}
		store.dispatch(ChatActions.interlocutorMessageTyping(eventData));
	}
}
