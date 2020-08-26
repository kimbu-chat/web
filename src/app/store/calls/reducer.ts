import { createReducer } from 'typesafe-actions';
import { CallActions } from './actions';
import { produce } from 'immer';
import { UserPreview } from '../my-profile/models';

export interface CallState {
	isFullScreen: boolean;
	isCalling: boolean;
	isCallingWithVideo?: boolean;
	isMediaSwitchingEnabled: boolean;
	amCalling: boolean;
	isSpeaking: boolean;
	interlocutor?: UserPreview;
	videoConstraints: {
		isOpened: boolean;
		width?: { min: number; ideal: number; max: number };
		height?: { min: number; ideal: number; max: number };
		deviceId?: string;
	};
	audioConstraints: {
		isOpened: boolean;
		deviceId?: string;
	};
	isScreenSharingOpened: boolean;
	offer?: RTCSessionDescriptionInit;
	answer?: RTCSessionDescriptionInit;
	audioDevicesList: MediaDeviceInfo[];
	videoDevicesList: MediaDeviceInfo[];
}

const initialState: CallState = {
	isFullScreen: false,
	isCalling: false,
	isSpeaking: false,
	videoConstraints: {
		isOpened: false,
		width: { min: 320, ideal: 320, max: 320 },
		height: { min: 240, ideal: 240, max: 240 },
	},
	audioConstraints: { isOpened: true },
	isScreenSharingOpened: false,
	amCalling: false,
	interlocutor: undefined,
	offer: undefined,
	answer: undefined,
	isMediaSwitchingEnabled: false,
	audioDevicesList: [],
	videoDevicesList: [],
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
		CallActions.outgoingCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.outgoingCallAction>) => {
			const interlocutor = payload.calling;
			draft.interlocutor = interlocutor;
			draft.amCalling = true;
			draft.audioConstraints = { ...draft.audioConstraints, ...payload.constraints.audio };
			draft.videoConstraints = { ...draft.videoConstraints, ...payload.constraints.video };
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
			draft.isFullScreen = false;
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
			draft.audioConstraints = { ...draft.audioConstraints, ...payload.constraints.audio };
			draft.videoConstraints = { ...draft.videoConstraints, ...payload.constraints.video };
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
			draft.isFullScreen = false;
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
			draft.isFullScreen = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.changeAudioStatusAction,
		produce((draft: CallState) => {
			draft.audioConstraints.isOpened = !draft.audioConstraints.isOpened;
			draft.isMediaSwitchingEnabled = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.changeVideoStatusAction,
		produce((draft: CallState) => {
			draft.videoConstraints.isOpened = !draft.videoConstraints.isOpened;
			draft.isScreenSharingOpened = false;
			draft.isMediaSwitchingEnabled = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.changeScreenShareStatusAction,
		produce((draft: CallState) => {
			draft.isMediaSwitchingEnabled = false;
			draft.videoConstraints.isOpened = false;
			draft.isScreenSharingOpened = !draft.isScreenSharingOpened;
			return draft;
		}),
	)
	.handleAction(
		CallActions.enableMediaSwitchingAction,
		produce((draft: CallState) => {
			draft.isMediaSwitchingEnabled = true;
			return draft;
		}),
	)
	.handleAction(
		CallActions.gotDevicesInfoAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.gotDevicesInfoAction>) => {
			if (payload.kind === 'videoinput') {
				draft.videoDevicesList = payload.devices;
			}

			if (payload.kind === 'audioinput') {
				draft.audioDevicesList = payload.devices;
			}

			return draft;
		}),
	)
	.handleAction(
		CallActions.switchDeviceAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.switchDeviceAction>) => {
			if (payload.kind === 'videoinput') {
				draft.videoConstraints.deviceId = payload.deviceId;
			}

			if (payload.kind === 'audioinput') {
				draft.audioConstraints.deviceId = payload.deviceId;
			}

			return draft;
		}),
	)
	.handleAction(
		CallActions.changeFullScreenStatusAction,
		produce((draft: CallState) => {
			draft.isFullScreen = !draft.isFullScreen;

			return draft;
		}),
	);

export default calls;
