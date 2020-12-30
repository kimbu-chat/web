import { Store } from 'redux';
import { ChatActions } from 'store/chats/actions';
import { RootState } from 'store/root-reducer';
import { IGroupChatCreatedIntegrationEvent } from '../integration-events/group-chat-сreated-integration-event';
import { IEventHandler } from '../event-handler';

export class GroupChatCreatedEventHandler implements IEventHandler<IGroupChatCreatedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IGroupChatCreatedIntegrationEvent): void {
    store.dispatch(ChatActions.createGroupChatFromEvent(eventData));
  }
}
