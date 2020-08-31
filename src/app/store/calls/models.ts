import { UserPreview } from '../my-profile/models';

export interface IConstraints {
	video: {
		isOpened: boolean;
	};
	audio: {
		isOpened: boolean;
	};
}

export interface ICompleteConstraints {
	video: {
		isOpened: boolean;
		width?: { min: number; ideal: number; max: number };
		height?: { min: number; ideal: number; max: number };
		deviceId?: string;
	};
	audio: {
		isOpened: boolean;
		deviceId?: string;
	};
}

export interface IncomingCallActionPayload {
	caller: UserPreview;
	offer: RTCSessionDescriptionInit;
	isVideoEnabled: boolean;
}

export interface OutgoingCallActionPayload {
	calling: UserPreview;
	constraints: IConstraints;
}

export interface AcceptIncomingCallActionPayload {
	constraints: IConstraints;
}

export interface InterlocutorAcceptCallActionPayload {
	answer: RTCSessionDescriptionInit;
	isVideoEnabled: boolean;
}

export interface CandidateActionPayload {
	candidate: RTCIceCandidate;
}

export interface GotMediaDevicesInfoActionPayload {
	kind: 'videoinput' | 'audioinput';
	devices: MediaDeviceInfo[];
}

export interface ChangeMediaStatusActionPayload {
	kind: 'videoinput' | 'audioinput';
}

export interface SwitchDeviceActionPayload {
	kind: 'videoinput' | 'audioinput';
	deviceId: string;
}

//Http requests

export interface EndCallApiRequest {
	interlocutorId: number;
}

export interface CandidateApiRequest {
	interlocutorId: number;
	candidate: RTCIceCandidate;
}

export interface CallApiRequest {
	interlocutorId: number;
	offer: RTCSessionDescriptionInit;
	caller: UserPreview;
}

export interface CancelCallApiRequest {
	interlocutorId: number;
}

export interface DeclineCallApiRequest {
	interlocutorId: number;
}

export interface AcceptCallApiRequest {
	interlocutorId: number;
}
