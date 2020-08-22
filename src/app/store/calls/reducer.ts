import { createReducer } from 'typesafe-actions';
import { CallActions } from './actions';
import { produce } from 'immer';
import { UserPreview } from '../my-profile/models';

export interface CallState {
	interlocutor?: UserPreview;
	isCalling: boolean;
	isCallingWithVideo?: boolean;
	amCalling: boolean;
	isSpeaking: boolean;
	isVideoOpened:
		| boolean
		| {
				width: { min: number; ideal: number; max: number };
				height: { min: number; ideal: number; max: number };
		  };
	isAudioOpened: boolean;
	offer?: RTCSessionDescriptionInit;
	answer?: RTCSessionDescriptionInit;
	isMediaSwitchingEnabled: boolean;
}

const initialState: CallState = {
	isCalling: false,
	isSpeaking: false,
	isVideoOpened: false,
	isAudioOpened: true,
	amCalling: false,
	interlocutor: undefined,
	offer: undefined,
	answer: undefined,
	isMediaSwitchingEnabled: false,
};

const calls = createReducer<CallState>(initialState)
	.handleAction(
		CallActions.incomingCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.incomingCallAction>) => {
			if (draft.interlocutor?.id === payload.caller.id && draft.isSpeaking) {
				//if it matches this condition then it's negociation
				return draft;
			}

			const interlocutor = payload.caller;
			const offer = payload.offer;
			draft.interlocutor = interlocutor;
			draft.isCalling = true;
			draft.offer = offer;

			if (draft.offer.sdp?.includes('video')) draft.isCallingWithVideo = true;

			return draft;
		}),
	)
	.handleAction(
		CallActions.outgoingCallSuccessAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.outgoingCallSuccessAction>) => {
			const interlocutor = payload.calling;
			draft.interlocutor = interlocutor;
			draft.amCalling = true;
			draft.isVideoOpened = payload.constraints.video;
			draft.isAudioOpened = payload.constraints.audio;
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
			draft.offer = undefined;
			draft.answer = undefined;
			return draft;
		}),
	)
	.handleAction(
		CallActions.acceptCallSuccessAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.acceptCallSuccessAction>) => {
			draft.isSpeaking = true;
			draft.isCalling = false;
			draft.amCalling = false;
			draft.isAudioOpened = payload.constraints.audio;
			draft.isVideoOpened = payload.constraints.video;
			draft.isMediaSwitchingEnabled = true;
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
			draft.offer = undefined;
			draft.answer = undefined;
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
			draft.isMediaSwitchingEnabled = true;
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
	)
	.handleAction(
		CallActions.changeAudioStatus,
		produce((draft: CallState) => {
			draft.isAudioOpened = !draft.isAudioOpened;
			draft.isMediaSwitchingEnabled = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.changeVideoStatus,
		produce((draft: CallState) => {
			draft.isVideoOpened = !draft.isVideoOpened;
			draft.isMediaSwitchingEnabled = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.enableMediaSwitching,
		produce((draft: CallState) => {
			draft.isMediaSwitchingEnabled = true;
			return draft;
		}),
	);

export default calls;
