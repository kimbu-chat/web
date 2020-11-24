import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IncomingCallIntegrationEvent } from '../integration-events/incoming-call-integration-event';

export class IncomingCallEventHandler implements IEventHandler<IncomingCallIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: IncomingCallIntegrationEvent): void {
		store.dispatch(CallActions.incomingCallAction({ ...eventData }));
	}
}
