import { AppState } from "..";
import { Dialog } from "./types";

export const getSelectedDialogSelector = (state: AppState): Dialog | undefined => {
    return state.dialogs?.dialogs?.find(x => x?.id === state?.dialogs?.selectedDialogId) || undefined
};