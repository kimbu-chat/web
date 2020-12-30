import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';
import { IInterlocutorAcceptedCallIntegrationEvent } from '../integration-events/interlocutor-accepted-call-integration-event';

export class InterlocutorAcceptedCallEventHandler implements IEventHandler<IInterlocutorAcceptedCallIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IInterlocutorAcceptedCallIntegrationEvent): void {
    store.dispatch(CallActions.interlocutorAcceptedCallAction({ ...eventData }));
  }
}
