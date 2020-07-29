import { Store } from 'redux';

import { StatusChangedIntegrationEvent } from '../integration-events/status-changed-integration-event';
import { IEventHandler } from '../event-handler';
import { RootState } from 'app/store/root-reducer';
import { FriendActions } from 'app/store/friends/actions';

export class UserStatusChangedEventHandler implements IEventHandler<StatusChangedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: StatusChangedIntegrationEvent): void {
    store.dispatch(FriendActions.userStatusChangedEvent(eventData));
  }
}
