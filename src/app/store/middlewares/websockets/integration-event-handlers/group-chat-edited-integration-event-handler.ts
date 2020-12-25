import { Store } from 'redux';
import { ChatActions } from 'store/chats/actions';
import { RootState } from 'store/root-reducer';
import { IEventHandler } from '../event-handler';
import { GroupChatEditedIntegrationEvent } from '../integration-events/group-chat-edited-integration-event';

export class GroupChatEditedEventHandler implements IEventHandler<GroupChatEditedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: GroupChatEditedIntegrationEvent): void {
    store.dispatch(ChatActions.groupChatEdited(eventData));
  }
}
