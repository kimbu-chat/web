import { IBaseAttachment } from 'app/store/chats/models';
import { MessageActions } from 'app/store/messages/actions';
import { RootState } from 'app/store/root-reducer';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { IMessageEditedIntegrationEvent } from '../integration-events/message-edited-integration-event';

export class MessageEditedEventHandler implements IEventHandler<IMessageEditedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IMessageEditedIntegrationEvent): void {
    store.dispatch(
      MessageActions.messageEdited({
        ...eventData,
        attachments: JSON.parse(eventData.attachments) as IBaseAttachment[],
      }),
    );
  }
}
