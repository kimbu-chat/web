import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'app/store/root-reducer';
import { CallActions } from 'app/store/calls/actions';
import { InterlocutorCanceledCallIntegrationEvent } from '../integration-events/interlocutor-canceled-call-integration-event';

export class InterlocutorCanceledCallEventHandler implements IEventHandler<InterlocutorCanceledCallIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: InterlocutorCanceledCallIntegrationEvent): void {
		store.dispatch(CallActions.interlocutorCanceledCallAction({ ...eventData }));
	}
}
