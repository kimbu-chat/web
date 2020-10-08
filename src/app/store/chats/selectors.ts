import { TFunction } from 'i18next';
import { RootState } from '../root-reducer';
import { Chat } from './models';

export const getSelectedChatSelector = (state: RootState): Chat | undefined => {
	return state.chats?.chats?.find((x: Chat) => x?.id === state?.chats?.selectedChatId) || undefined;
};

export const getTypingString = (t: TFunction, chat: Chat): string | undefined => {
	const typingUsers = chat?.typingInterlocutors;
	if (typingUsers) {
		if (typingUsers.length === 1) {
			return t('chat.typing', { firstInterlocutorName: typingUsers[0].fullName.split(' ')[0] });
		} else if (typingUsers.length === 2) {
			return t('chat.typing_two', {
				firstInterlocutorName: typingUsers[0].fullName.split(' ')[0],
				secondInterlocutorName: typingUsers[1].fullName.split(' ')[0],
			});
		} else if (typingUsers.length > 2) {
			return t('chat.typing_many', {
				firstInterlocutorName: typingUsers[0].fullName.split(' ')[0],
				secondInterlocutorName: typingUsers[1].fullName.split(' ')[0],
				remainingCount: typingUsers.length - 2,
			});
		}
	}

	return undefined;
};
