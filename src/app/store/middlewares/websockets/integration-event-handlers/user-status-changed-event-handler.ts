import { Store } from 'redux';

import { AppState } from 'app/store';
import { StatusChangedIntegrationEvent } from '../integration-events/status-changed-integration-event';
import { AuthActionTypes } from 'app/store/auth/types';
import { IEventHandler } from '../event-handler';

export class UserStatusChangedEventHandler implements IEventHandler<StatusChangedIntegrationEvent> {
  public handle(store: Store<AppState>, eventData: StatusChangedIntegrationEvent): void {
    store.dispatch({ type: AuthActionTypes.USER_STATUS_CHANGED_EVENT, payload: eventData });
  }
}
