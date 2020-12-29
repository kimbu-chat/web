import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { RenegotiationAccepted } from 'store/calls/features/renegotiation/renegotiation-accepted';
import { IEventHandler } from '../event-handler';
import { RenegotiationAcceptedIntegrationEvent } from '../integration-events/renegotiation-accepted-integration-event';

export class RenegotiationAcceptedEventHandler implements IEventHandler<RenegotiationAcceptedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: RenegotiationAcceptedIntegrationEvent): void {
    store.dispatch(RenegotiationAccepted.action(eventData));
  }
}
