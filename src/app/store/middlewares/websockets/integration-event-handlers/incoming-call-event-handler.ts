import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';
import { IIncomingCallIntegrationEvent } from '../integration-events/incoming-call-integration-event';

export class IncomingCallEventHandler implements IEventHandler<IIncomingCallIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IIncomingCallIntegrationEvent): void {
    store.dispatch(CallActions.incomingCallAction({ ...eventData }));
  }
}
