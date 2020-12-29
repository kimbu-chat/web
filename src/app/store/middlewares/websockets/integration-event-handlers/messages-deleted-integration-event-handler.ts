import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { MessagesDeletedFromEvent } from 'store/messages/features/delete-message/messages-deleted-from-event';
import { IEventHandler } from '../event-handler';
import { MessagesDeletedIntegrationEvent } from '../integration-events/messages-deleted-integration-event';

export class MessagesDeletedIntegrationEventHandler implements IEventHandler<MessagesDeletedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: MessagesDeletedIntegrationEvent): void {
    store.dispatch(MessagesDeletedFromEvent.action(eventData));
  }
}
