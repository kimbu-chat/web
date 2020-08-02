import { Store } from 'redux';

import { IEventHandler } from '../event-handler';
import { MessagesReadIntegrationEvent } from '../integration-events/messages-read-integration-event';
import { ChatActions } from 'app/store/dialogs/actions';
import { RootState } from 'app/store/root-reducer';

export class ConferenceMessageReadEventHandler implements IEventHandler<MessagesReadIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: MessagesReadIntegrationEvent): void {
		store.dispatch(ChatActions.changeInterlocutorLastReadMessageId(eventData));
	}
}
