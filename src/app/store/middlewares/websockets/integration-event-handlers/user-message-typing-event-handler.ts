import { IntercolutorMessageTypingIntegrationEvent } from '../integration-events/interlocutor-message-typing-integration-event';
import { Store } from 'redux';
import { AppState } from 'app/store';
import { INTERLOCUTOR_STOPPED_TYPING, INTERLOCUTOR_MESSAGE_TYPING_EVENT } from 'app/store/messages/types';
import { IEventHandler } from '../event-handler';

export class UserMessageTypingEventHandler implements IEventHandler<IntercolutorMessageTypingIntegrationEvent> {
  public handle(store: Store<AppState>, eventData: IntercolutorMessageTypingIntegrationEvent): void {
    eventData.timeoutId = setTimeout(() => {
      store.dispatch({ type: INTERLOCUTOR_STOPPED_TYPING, payload: eventData });
    }, 1500);

    if (eventData.isConference && eventData.objectId === store.getState().auth.authentication.userId) {
      return;
    }

    store.dispatch({ type: INTERLOCUTOR_MESSAGE_TYPING_EVENT, payload: eventData });
  }
}
