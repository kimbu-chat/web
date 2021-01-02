import { Store } from 'redux';
import { RootState } from 'store/root-reducer';
import { ChatActions } from 'store/chats/actions';
import { InterlocutorType } from 'store/chats/models';
import { ChatId } from 'store/chats/chat-id';
import { IEventHandler } from '../event-handler';
import { IIntercolutorMessageTypingIntegrationEvent } from '../integration-events/interlocutor-message-typing-integration-event';

export class UserMessageTypingEventHandler implements IEventHandler<IIntercolutorMessageTypingIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IIntercolutorMessageTypingIntegrationEvent): void {
    eventData.timeoutId = (setTimeout(() => {
      store.dispatch(ChatActions.interlocutorStoppedTyping(eventData));
    }, 1500) as unknown) as NodeJS.Timeout;

    if (ChatId.fromId(eventData.chatId).interlocutorType === InterlocutorType.GroupChat && eventData.interlocutorId === store.getState().myProfile.user?.id) {
      return;
    }
    store.dispatch(ChatActions.interlocutorMessageTyping(eventData));
  }
}
