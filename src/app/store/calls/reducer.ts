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
	offer?: RTCSessionDescriptionInit;
	answer?: RTCSessionDescriptionInit;
}

const initialState: CallState = {
	isCalling: false,
	isSpeaking: false,
	isVideoOpened: false,
	isAudioOpened: true,
	amCalling: false,
};

const calls = createReducer<CallState>(initialState)
	.handleAction(
		CallActions.incomingCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.incomingCallAction>) => {
			const interlocutor = payload.caller;
			const offer = payload.offer;
			draft.interlocutor = interlocutor;
			draft.isCalling = true;
			draft.offer = offer;
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
		CallActions.cancelCallSuccessAction,
		produce((draft: CallState) => {
			draft.interlocutor = undefined;
			draft.amCalling = false;
			draft.isCalling = false;
			draft.isSpeaking = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.acceptCallAction,
		produce((draft: CallState) => {
			draft.isSpeaking = true;
			draft.isCalling = false;
			draft.amCalling = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.interlocutorCanceledCallAction,
		produce((draft: CallState) => {
			draft.interlocutor = undefined;
			draft.amCalling = false;
			draft.isCalling = false;
			draft.isSpeaking = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.interlocutorAcceptedCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.interlocutorAcceptedCallAction>) => {
			draft.isSpeaking = true;
			draft.isCalling = false;
			draft.amCalling = false;
			draft.answer = payload.answer;
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
