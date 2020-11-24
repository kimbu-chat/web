import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'app/store/root-reducer';
import { CallActions } from 'app/store/calls/actions';

export class BusyCallEvenHandler implements IEventHandler {
	public handle(store: Store<RootState>): void {
		store.dispatch(CallActions.interlocutorBusyAction());
	}
}
