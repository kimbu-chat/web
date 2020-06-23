import { Store } from 'redux';
import { AppState } from 'app/store';
import { DialogsActionTypes } from 'app/store/dialogs/types';
import { ConferenceCreatedIntegrationEvent } from '../integration-events/conference-сreated-integration-event';
import { IEventHandler } from '../event-handler';

export class ConferenceCreatedEventHandler implements IEventHandler<ConferenceCreatedIntegrationEvent> {
  public handle(
    store: Store<AppState>,
    eventData: ConferenceCreatedIntegrationEvent
  ): void {
    store.dispatch({ type: DialogsActionTypes.CREATE_CONFERENCE_FROM_EVENT, payload: eventData });
  }
}
