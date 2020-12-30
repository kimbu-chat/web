import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { RenegotiationAccepted } from 'store/calls/features/renegotiation/renegotiation-accepted';
import { IEventHandler } from '../event-handler';
import { IRenegotiationAcceptedIntegrationEvent } from '../integration-events/renegotiation-accepted-integration-event';

export class RenegotiationAcceptedEventHandler implements IEventHandler<IRenegotiationAcceptedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IRenegotiationAcceptedIntegrationEvent): void {
    store.dispatch(RenegotiationAccepted.action(eventData));
  }
}
