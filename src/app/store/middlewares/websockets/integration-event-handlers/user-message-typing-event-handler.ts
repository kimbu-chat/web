import { IntercolutorMessageTypingIntegrationEvent } from '../integration-events/interlocutor-message-typing-integration-event';
import { Store } from 'redux';
import { AppState } from 'app/store';
import { IEventHandler } from '../event-handler';
import { MessagesActionTypes } from 'app/store/messages/types';

export class UserMessageTypingEventHandler implements IEventHandler<IntercolutorMessageTypingIntegrationEvent> {
  public handle(store: Store<AppState>, eventData: IntercolutorMessageTypingIntegrationEvent): void {
    eventData.timeoutId = setTimeout(() => {
      store.dispatch({ type: MessagesActionTypes.INTERLOCUTOR_STOPPED_TYPING, payload: eventData });
    }, 1500);

    if (eventData.isConference && eventData.objectId === store.getState().auth.authentication.userId) {
      return;
    }

    store.dispatch({ type: MessagesActionTypes.INTERLOCUTOR_MESSAGE_TYPING_EVENT, payload: eventData });
  }
}
