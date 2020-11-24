import { MessagesReadIntegrationEvent } from '../integration-events/messages-read-integration-event';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'store/root-reducer';
import { ChatActions } from 'store/chats/actions';

export class UserMessageReadEventHandler implements IEventHandler<MessagesReadIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: MessagesReadIntegrationEvent): void {
		store.dispatch(ChatActions.changeInterlocutorLastReadMessageId(eventData));
	}
}
