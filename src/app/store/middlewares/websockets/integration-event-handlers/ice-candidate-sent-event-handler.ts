import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';
import { IceCandidateSentIntegrationEvent } from '../integration-events/ice-candidate-sent-integration-event';

export class IceCandidateSentEventHandler implements IEventHandler<IceCandidateSentIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IceCandidateSentIntegrationEvent): void {
    store.dispatch(CallActions.candidateAction({ ...eventData }));
  }
}
