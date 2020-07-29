import { BaseIntegrationEvent } from './integration-events/base-integration-event';
import { Store } from 'redux';
import { RootState } from 'app/store/root-reducer';

export interface IEventHandler<T extends BaseIntegrationEvent = any> {
  handle(store: Store<RootState>, eventData: T): void;
}
