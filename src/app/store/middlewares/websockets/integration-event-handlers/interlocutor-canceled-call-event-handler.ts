import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';
import { InterlocutorCanceledCallIntegrationEvent } from '../integration-events/interlocutor-canceled-call-integration-event';

export class InterlocutorCanceledCallEventHandler implements IEventHandler<InterlocutorCanceledCallIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: InterlocutorCanceledCallIntegrationEvent): void {
    store.dispatch(CallActions.interlocutorCanceledCallAction(eventData));
  }
}
