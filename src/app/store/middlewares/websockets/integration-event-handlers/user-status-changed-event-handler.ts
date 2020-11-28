import { Store } from 'redux';

import { RootState } from 'store/root-reducer';
import { FriendActions } from 'store/friends/actions';
import { StatusChangedIntegrationEvent } from '../integration-events/status-changed-integration-event';
import { IEventHandler } from '../event-handler';

export class UserStatusChangedEventHandler implements IEventHandler<StatusChangedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: StatusChangedIntegrationEvent): void {
    store.dispatch(FriendActions.userStatusChangedEvent(eventData));
  }
}
