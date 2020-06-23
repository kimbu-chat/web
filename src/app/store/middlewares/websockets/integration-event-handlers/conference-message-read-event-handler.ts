import { Store } from 'redux';

import { AppState } from 'app/store';
import { DialogsActionTypes } from 'app/store/dialogs/types';
import { IEventHandler } from '../event-handler';
import { MessagesReadIntegrationEvent } from '../integration-events/messages-read-integration-event';

export class ConferenceMessageReadEventHandler implements IEventHandler<MessagesReadIntegrationEvent> {
  public handle(store: Store<AppState>, eventData: MessagesReadIntegrationEvent): void {
    store.dispatch({ type: DialogsActionTypes.CONFERENCE_MESSAGE_READ_FROM_EVENT, payload: eventData });
  }
}
