import { Store } from 'redux';
import { ChatActions } from 'store/chats/actions';
import { RootState } from 'store/root-reducer';
import { GroupChatCreatedIntegrationEvent } from '../integration-events/group-chat-сreated-integration-event';
import { IEventHandler } from '../event-handler';

export class GroupChatCreatedEventHandler implements IEventHandler<GroupChatCreatedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: GroupChatCreatedIntegrationEvent): void {
    store.dispatch(ChatActions.createGroupChatFromEvent(eventData));
  }
}
