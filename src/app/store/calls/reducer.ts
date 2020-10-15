import { createReducer } from 'typesafe-actions';
import { CallActions } from './actions';
import { produce } from 'immer';
import { UserPreview } from '../my-profile/models';

export interface CallState {
	isActiveCallIncoming?: boolean;
	isCalling: boolean;
	isInterlocutorVideoEnabled: boolean;
	amICaling: boolean;
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
	isInterlocutorVideoEnabled: false,
	isCalling: false,
	isSpeaking: false,
	videoConstraints: {
		isOpened: false,
		width: { min: 640, ideal: 1920, max: 1920 },
		height: { min: 480, ideal: 1440, max: 1440 },
	},
	audioConstraints: { isOpened: true },
	isScreenSharingOpened: false,
	amICaling: false,
	interlocutor: undefined,
	offer: undefined,
	answer: undefined,
	audioDevicesList: [],
	videoDevicesList: [],
};

const calls = createReducer<CallState>(initialState)
	.handleAction(
		CallActions.incomingCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.incomingCallAction>) => {
			draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;

			if (draft.isSpeaking) {
				//if it matches this condition then it's negociation
				return draft;
			}

			const interlocutor = payload.caller;
			const offer = payload.offer;
			draft.interlocutor = interlocutor;
			draft.isCalling = true;
			draft.isActiveCallIncoming = true;
			draft.offer = offer;

			return draft;
		}),
	)
	.handleAction(
		CallActions.outgoingCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.outgoingCallAction>) => {
			const interlocutor = payload.calling;
			draft.interlocutor = interlocutor;
			draft.amICaling = true;
			draft.isActiveCallIncoming = false;
			draft.audioConstraints = { ...draft.audioConstraints, ...payload.constraints.audio };
			draft.videoConstraints = { ...draft.videoConstraints, ...payload.constraints.video };
			return draft;
		}),
	)
	.handleAction(
		CallActions.cancelCallSuccessAction,
		produce((draft: CallState) => {
			draft.interlocutor = undefined;
			draft.amICaling = false;
			draft.isCalling = false;
			draft.isSpeaking = false;
			draft.offer = undefined;
			draft.answer = undefined;
			draft.isInterlocutorVideoEnabled = false;
			draft.videoConstraints.isOpened = false;
			draft.videoConstraints.isOpened = false;
			draft.isScreenSharingOpened = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.acceptCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.acceptCallAction>) => {
			draft.audioConstraints = { ...draft.audioConstraints, ...payload.constraints.audio };
			draft.videoConstraints = { ...draft.videoConstraints, ...payload.constraints.video };
			return draft;
		}),
	)
	.handleAction(
		CallActions.acceptCallSuccessAction,
		produce((draft: CallState) => {
			draft.isSpeaking = true;
			draft.isCalling = false;
			draft.amICaling = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.interlocutorCanceledCallAction,
		produce((draft: CallState) => {
			draft.interlocutor = undefined;
			draft.amICaling = false;
			draft.isCalling = false;
			draft.isSpeaking = false;
			draft.offer = undefined;
			draft.answer = undefined;
			draft.videoConstraints.isOpened = false;
			draft.videoConstraints.isOpened = false;
			draft.isInterlocutorVideoEnabled = false;
			draft.isScreenSharingOpened = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.interlocutorAcceptedCallAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.interlocutorAcceptedCallAction>) => {
			draft.isSpeaking = true;
			draft.isCalling = false;
			draft.amICaling = false;
			draft.answer = payload.answer;
			draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;
			return draft;
		}),
	)
	.handleAction(
		CallActions.callEndedAction,
		produce((draft: CallState) => {
			draft.interlocutor = undefined;
			draft.amICaling = false;
			draft.isCalling = false;
			draft.isSpeaking = false;
			draft.videoConstraints.isOpened = false;
			draft.videoConstraints.isOpened = false;
			draft.isInterlocutorVideoEnabled = false;
			draft.isScreenSharingOpened = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.changeMediaStatusAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.changeMediaStatusAction>) => {
			if (payload.kind === 'videoinput') {
				draft.isScreenSharingOpened = false;
				draft.videoConstraints.isOpened = !draft.videoConstraints.isOpened;
			}

			if (payload.kind === 'audioinput') {
				draft.audioConstraints.isOpened = !draft.audioConstraints.isOpened;
			}

			return draft;
		}),
	)
	.handleAction(
		CallActions.changeScreenShareStatusAction,
		produce((draft: CallState) => {
			draft.isScreenSharingOpened = !draft.isScreenSharingOpened;
			draft.videoConstraints.isOpened = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.closeScreenShareStatusAction,
		produce((draft: CallState) => {
			draft.isScreenSharingOpened = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.closeAudioStatusAction,
		produce((draft: CallState) => {
			draft.audioConstraints.isOpened = false;
			return draft;
		}),
	)
	.handleAction(
		CallActions.closeVideoStatusAction,
		produce((draft: CallState) => {
			draft.videoConstraints.isOpened = false;
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
		CallActions.changeActiveDeviceIdAction,
		produce((draft: CallState, { payload }: ReturnType<typeof CallActions.changeActiveDeviceIdAction>) => {
			if (payload.kind === 'videoinput') {
				draft.videoConstraints.deviceId = payload.deviceId;
			}

			if (payload.kind === 'audioinput') {
				draft.audioConstraints.deviceId = payload.deviceId;
			}

			return draft;
		}),
	);

export default calls;
