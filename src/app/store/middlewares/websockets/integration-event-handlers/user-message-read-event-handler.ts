import { MessagesReadIntegrationEvent } from '../integration-events/messages-read-integration-event';
import { AppState } from 'app/store';
import { Store } from 'redux';
import { USER_MESSAGE_READ_FROM_EVENT } from 'app/store/messages/types';
import { IEventHandler } from '../event-handler';

export class UserMessageReadEventHandler implements IEventHandler<MessagesReadIntegrationEvent> {
  public handle(store: Store<AppState>, eventData: MessagesReadIntegrationEvent): void {
    store.dispatch({ type: USER_MESSAGE_READ_FROM_EVENT, payload: eventData });
  }
}
