import { ChatHistoryClearedFromEvent } from 'app/store/messages/features/clear-history/chat-history-cleared-from-event';
import { RootState } from 'app/store/root-reducer';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { ChatClearedIntegrationEvent } from '../integration-events/chat-cleared-integration-event';

export class ChatClearedIntegrationEventHandler implements IEventHandler<ChatClearedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: ChatClearedIntegrationEvent): void {
    store.dispatch(ChatHistoryClearedFromEvent.action({ ...eventData }));
  }
}
