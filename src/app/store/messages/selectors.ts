import { RootState } from '../root-reducer';

export const setSelectedMessagesLength = (state: RootState): number => {
	return state.messages.selectedMessageIds.length;
};
