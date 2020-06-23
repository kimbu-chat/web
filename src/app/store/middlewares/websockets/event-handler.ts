import { BaseIntegrationEvent } from './integration-events/base-integration-event';
import { Store } from 'redux';
import { AppState } from 'app/store';

export interface IEventHandler<T extends BaseIntegrationEvent = any> {
  handle(store: Store<AppState>, eventData: T): void;
}
