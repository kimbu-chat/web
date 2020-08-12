import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'app/store/root-reducer';
import { CallActions } from 'app/store/calls/actions';
import { CandidateIntegrationEvent } from '../integration-events/candidate-integration-event';

export class CandidateEventHandler implements IEventHandler<CandidateIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: CandidateIntegrationEvent): void {
		store.dispatch(CallActions.candidateAction({ ...eventData }));
	}
}
