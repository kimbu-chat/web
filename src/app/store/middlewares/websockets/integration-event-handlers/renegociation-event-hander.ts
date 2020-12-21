import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { Renegotiation } from '../../../calls/features/renegotiation/renegotiation';
import { IEventHandler } from '../event-handler';
import { RenegotiationIntegrationEvent } from '../integration-events/renegociation-integration-event';

export class RenegotiationEventHandler implements IEventHandler<RenegotiationIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: RenegotiationIntegrationEvent): void {
    store.dispatch(Renegotiation.action(eventData));
  }
}
