import { RootState } from '../root-reducer';

export const setSelectedMessagesLength = (state: RootState): number => state.messages.selectedMessageIds.length;
