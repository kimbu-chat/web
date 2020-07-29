import { MessagesReadIntegrationEvent } from '../integration-events/messages-read-integration-event';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'app/store/root-reducer';
import { ChatActions } from 'app/store/dialogs/actions';

export class UserMessageReadEventHandler implements IEventHandler<MessagesReadIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: MessagesReadIntegrationEvent): void {
    store.dispatch(ChatActions.changeInterlocutorLastReadMessageId(eventData));
  }
}
