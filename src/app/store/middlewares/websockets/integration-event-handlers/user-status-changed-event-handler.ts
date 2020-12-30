import { Store } from 'redux';

import { RootState } from 'store/root-reducer';
import { FriendActions } from 'store/friends/actions';
import { IStatusChangedIntegrationEvent } from '../integration-events/status-changed-integration-event';
import { IEventHandler } from '../event-handler';

export class UserStatusChangedEventHandler implements IEventHandler<IStatusChangedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IStatusChangedIntegrationEvent): void {
    store.dispatch(FriendActions.userStatusChangedEvent(eventData));
  }
}
