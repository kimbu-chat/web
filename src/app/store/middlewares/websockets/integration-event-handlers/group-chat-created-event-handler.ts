import { Store } from 'redux';
import { GroupChatCreatedIntegrationEvent } from '../integration-events/group-chat-сreated-integration-event';
import { IEventHandler } from '../event-handler';
import { ChatActions } from 'store/chats/actions';
import { RootState } from 'store/root-reducer';

export class GroupChatCreatedEventHandler implements IEventHandler<GroupChatCreatedIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: GroupChatCreatedIntegrationEvent): void {
		store.dispatch(ChatActions.createGroupChatFromEvent(eventData));
	}
}
