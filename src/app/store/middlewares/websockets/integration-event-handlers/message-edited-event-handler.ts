import { BaseAttachment } from 'app/store/chats/models';
import { MessageActions } from 'app/store/messages/actions';
import { RootState } from 'app/store/root-reducer';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { MessageEditedIntegrationEvent } from '../integration-events/message-edited-integration-event';

export class MessageEditedEventHandler implements IEventHandler<MessageEditedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: MessageEditedIntegrationEvent): void {
    store.dispatch(
      MessageActions.messageEdited({
        ...eventData,
        attachments: JSON.parse(eventData.attachments) as BaseAttachment[],
      }),
    );
  }
}
