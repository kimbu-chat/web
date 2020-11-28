import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';
import { CandidateIntegrationEvent } from '../integration-events/candidate-integration-event';

export class CandidateEventHandler implements IEventHandler<CandidateIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: CandidateIntegrationEvent): void {
    store.dispatch(CallActions.candidateAction({ ...eventData }));
  }
}
