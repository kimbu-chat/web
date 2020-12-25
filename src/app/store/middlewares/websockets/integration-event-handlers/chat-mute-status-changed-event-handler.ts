import { ChatMutedStatusChanged } from 'app/store/chats/features/change-chat-muted-status/chat-muted-status-changed';
import { RootState } from 'app/store/root-reducer';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { ChatMutedStatusChangedIntegrationEvent } from '../integration-events/chat-mute-status-changed-integration-event';

export class ChatMutedStatusChangedEventHandler implements IEventHandler<ChatMutedStatusChangedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: ChatMutedStatusChangedIntegrationEvent): void {
    store.dispatch(ChatMutedStatusChanged.action({ ...eventData }));
  }
}
