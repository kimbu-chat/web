import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { ChatActions } from 'store/chats/actions';
import { IEventHandler } from '../event-handler';
import { MessagesReadIntegrationEvent } from '../integration-events/messages-read-integration-event';

export class UserMessageReadEventHandler implements IEventHandler<MessagesReadIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: MessagesReadIntegrationEvent): void {
    store.dispatch(ChatActions.changeInterlocutorLastReadMessageId(eventData));
  }
}
