import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';
import { InterlocutorAcceptedCallIntegrationEvent } from '../integration-events/interlocutor-accepted-call-integration-event';

export class InterlocutorAcceptedCallEventHandler implements IEventHandler<InterlocutorAcceptedCallIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: InterlocutorAcceptedCallIntegrationEvent): void {
    store.dispatch(CallActions.interlocutorAcceptedCallAction({ ...eventData }));
  }
}
