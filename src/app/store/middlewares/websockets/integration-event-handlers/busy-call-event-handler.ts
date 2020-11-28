import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { CallActions } from 'store/calls/actions';
import { IEventHandler } from '../event-handler';

export class BusyCallEvenHandler implements IEventHandler {
  public handle(store: Store<RootState>): void {
    store.dispatch(CallActions.interlocutorBusyAction());
  }
}
