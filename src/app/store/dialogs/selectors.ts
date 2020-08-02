import { RootState } from '../root-reducer';
import { Dialog } from './models';

export const getSelectedDialogSelector = (state: RootState): Dialog | undefined => {
	return state.dialogs?.dialogs?.find((x: Dialog) => x?.id === state?.dialogs?.selectedDialogId) || undefined;
};
