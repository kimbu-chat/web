import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'app/store/root-reducer';
import { CallActions } from 'app/store/calls/actions';
import { InterlocutorAcceptedCallIntegrationEvent } from '../integration-events/interlocutor-accepted-call-integration-event';

export class InterlocutorAcceptedCallEventHandler implements IEventHandler<InterlocutorAcceptedCallIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: InterlocutorAcceptedCallIntegrationEvent): void {
		store.dispatch(CallActions.interlocutorAcceptedCallAction({ ...eventData }));
	}
}
