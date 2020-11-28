import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';
import { IncomingCallIntegrationEvent } from '../integration-events/incoming-call-integration-event';

export class IncomingCallEventHandler implements IEventHandler<IncomingCallIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IncomingCallIntegrationEvent): void {
    store.dispatch(CallActions.incomingCallAction({ ...eventData }));
  }
}
