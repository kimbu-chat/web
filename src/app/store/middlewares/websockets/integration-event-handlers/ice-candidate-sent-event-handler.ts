import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';
import { IIceCandidateSentIntegrationEvent } from '../integration-events/ice-candidate-sent-integration-event';

export class IceCandidateSentEventHandler implements IEventHandler<IIceCandidateSentIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IIceCandidateSentIntegrationEvent): void {
    store.dispatch(CallActions.candidateAction({ ...eventData }));
  }
}
