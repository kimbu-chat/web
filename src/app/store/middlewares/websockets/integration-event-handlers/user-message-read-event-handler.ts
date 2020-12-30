import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { ChatActions } from 'store/chats/actions';
import { IEventHandler } from '../event-handler';
import { IMessagesReadIntegrationEvent } from '../integration-events/messages-read-integration-event';

export class UserMessageReadEventHandler implements IEventHandler<IMessagesReadIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IMessagesReadIntegrationEvent): void {
    store.dispatch(ChatActions.changeInterlocutorLastReadMessageId(eventData));
  }
}
