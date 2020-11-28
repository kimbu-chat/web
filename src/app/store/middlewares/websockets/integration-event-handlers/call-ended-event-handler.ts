import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';
import { CallEndedIntegrationEvent } from '../integration-events/call-ended-integration-event';

export class CallEndedEventHandler implements IEventHandler<CallEndedIntegrationEvent> {
  public handle(store: Store<RootState>): void {
    store.dispatch(CallActions.callEndedAction());
  }
}
