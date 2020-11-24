import { Store } from 'redux';
import { RootState } from 'store/root-reducer';

export interface IEventHandler<T = any> {
	handle(store: Store<RootState>, eventData: T): void;
}
