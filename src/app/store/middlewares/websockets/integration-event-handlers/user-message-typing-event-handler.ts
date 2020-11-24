import { IntercolutorMessageTypingIntegrationEvent } from '../integration-events/interlocutor-message-typing-integration-event';
import { Store } from 'redux';
import { IEventHandler } from '../event-handler';
import { RootState } from 'store/root-reducer';
import { ChatActions } from 'store/chats/actions';
import { InterlocutorType } from 'store/chats/models';
import { ChatId } from 'store/chats/chat-id';

export class UserMessageTypingEventHandler implements IEventHandler<IntercolutorMessageTypingIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: IntercolutorMessageTypingIntegrationEvent): void {
		eventData.timeoutId = (setTimeout(() => {
			store.dispatch(ChatActions.interlocutorStoppedTyping(eventData));
		}, 1500) as unknown) as NodeJS.Timeout;

		console.log('Chatid', new ChatId().FromId(eventData.chatId).interlocutorType);

		if (
			new ChatId().FromId(eventData.chatId).interlocutorType === InterlocutorType.GROUP_CHAT &&
			eventData.interlocutorId === store.getState().myProfile.user?.id
		) {
			return;
		}
		store.dispatch(ChatActions.interlocutorMessageTyping(eventData));
	}
}
