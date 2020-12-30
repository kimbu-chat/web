import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { MessagesDeletedFromEvent } from 'store/messages/features/delete-message/messages-deleted-from-event';
import { IEventHandler } from '../event-handler';
import { IMessagesDeletedIntegrationEvent } from '../integration-events/messages-deleted-integration-event';

export class MessagesDeletedIntegrationEventHandler implements IEventHandler<IMessagesDeletedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IMessagesDeletedIntegrationEvent): void {
    store.dispatch(MessagesDeletedFromEvent.action(eventData));
  }
}
