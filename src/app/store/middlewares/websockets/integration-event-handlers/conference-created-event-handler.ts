import { Store } from 'redux';
import { ConferenceCreatedIntegrationEvent } from '../integration-events/conference-сreated-integration-event';
import { IEventHandler } from '../event-handler';
import { ChatActions } from 'app/store/dialogs/actions';
import { RootState } from 'app/store/root-reducer';

export class ConferenceCreatedEventHandler implements IEventHandler<ConferenceCreatedIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: ConferenceCreatedIntegrationEvent): void {
		store.dispatch(ChatActions.createConferenceFromEvent(eventData));
	}
}
