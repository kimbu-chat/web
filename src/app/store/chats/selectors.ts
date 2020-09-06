import { RootState } from '../root-reducer';
import { Chat } from './models';

export const getSelectedChatSelector = (state: RootState): Chat | undefined => {
	return state.chats?.chats?.find((x: Chat) => x?.id === state?.chats?.selectedChatId) || undefined;
};
