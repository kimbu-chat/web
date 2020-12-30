import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { Renegotiation } from 'store/calls/features/renegotiation/renegotiation';
import { IEventHandler } from '../event-handler';
import { IRenegotiationIntegrationEvent } from '../integration-events/renegotiation-integration-event';

export class RenegotiationEventHandler implements IEventHandler<IRenegotiationIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IRenegotiationIntegrationEvent): void {
    store.dispatch(Renegotiation.action(eventData));
  }
}
