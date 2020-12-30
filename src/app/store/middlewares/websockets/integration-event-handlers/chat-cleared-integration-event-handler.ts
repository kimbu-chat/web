import { ChatHistoryClearedFromEvent } from 'app/store/messages/features/clear-history/chat-history-cleared-from-event';
import { RootState } from 'app/store/root-reducer';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { IChatClearedIntegrationEvent } from '../integration-events/chat-cleared-integration-event';

export class ChatClearedIntegrationEventHandler implements IEventHandler<IChatClearedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IChatClearedIntegrationEvent): void {
    store.dispatch(ChatHistoryClearedFromEvent.action({ ...eventData }));
  }
}
