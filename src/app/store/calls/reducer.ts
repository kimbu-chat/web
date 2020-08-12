import { createReducer } from 'typesafe-actions';
import { CallActions } from './actions';
import { produce } from 'immer';
import { UserPreview } from '../my-profile/models';

export interface CallState {
	interlocutor?: UserPreview;
	isCalling: boolean;
	amCalling: boolean;
	isSpeaking: boolean;
	isVideoOpened: boolean;
	isAudioOpened: boolean;
}

const initialState: CallState = {
	isCalling: false,
	isSpeaking: false,
	isVideoOpened: false,
	isAudioOpened: false,
	amCalling: false,
};

const calls = createReducer<CallState>(initialState)
	.handleAction(
		CallActions.incomingCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.incomingCallAction>) => {
			const interlocutor = payload.caller;
			draft.interlocutor = interlocutor;
			draft.isCalling = true;
			return draft;
		}),
	)
	.handleAction(
		CallActions.outgoingCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.outgoingCallAction>) => {
			const interlocutor = payload.calling;
			draft.interlocutor = interlocutor;
			draft.amCalling = true;
			return draft;
		}),
	)
	.handleAction(
		CallActions.cancelCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.cancelCallAction>) => {
			if (draft.interlocutor?.id === payload.interlocutor.id) {
				draft.interlocutor = undefined;
				draft.amCalling = false;
				draft.isCalling = false;
				draft.isSpeaking = false;
			}
			return draft;
		}),
	)
	.handleAction(
		CallActions.acceptCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.acceptCallAction>) => {
			if (draft.interlocutor?.id === payload.interlocutor.id) {
				draft.isSpeaking = true;
				draft.isCalling = false;
				draft.amCalling = false;
			}
			return draft;
		}),
	)
	.handleAction(
		CallActions.interlocutorCanceledCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.interlocutorCanceledCallAction>) => {
			if (draft.interlocutor?.id === payload.interlocutor.id) {
				draft.interlocutor = undefined;
				draft.amCalling = false;
				draft.isCalling = false;
				draft.isSpeaking = false;
			}
			return draft;
		}),
	)
	.handleAction(
		CallActions.interlocutorAcceptedCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.interlocutorAcceptedCallAction>) => {
			if (draft.interlocutor?.id === payload.interlocutor.id) {
				draft.isSpeaking = true;
				draft.isCalling = false;
				draft.amCalling = false;
			}
			return draft;
		}),
	)
	.handleAction(
		CallActions.callEndedAction,
		produce((draft: CallState) => {
			draft.interlocutor = undefined;
			draft.amCalling = false;
			draft.isCalling = false;
			draft.isSpeaking = false;
			return draft;
		}),
	);

export default calls;
