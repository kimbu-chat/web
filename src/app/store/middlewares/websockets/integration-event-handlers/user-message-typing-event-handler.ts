import { IntercolutorMessageTypingIntegrationEvent } from '../integration-events/interlocutor-message-typing-integration-event';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'app/store/root-reducer';
import { ChatActions } from 'app/store/chats/actions';
import { InterlocutorType } from 'app/store/chats/models';
import { ChatId } from 'app/store/chats/chat-id';

export class UserMessageTypingEventHandler implements IEventHandler<IntercolutorMessageTypingIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: IntercolutorMessageTypingIntegrationEvent): void {
		eventData.timeoutId = (setTimeout(() => {
			store.dispatch(ChatActions.interlocutorStoppedTyping(eventData));
		}, 1500) as unknown) as NodeJS.Timeout;

		if (
			new ChatId().From(eventData.chatId).interlocutorType === InterlocutorType.GROUP_CHAT &&
			eventData.interlocutorId === store.getState().myProfile.user?.id
		) {
			console.log('not match');
			return;
		}
		store.dispatch(ChatActions.interlocutorMessageTyping(eventData));
	}
}
