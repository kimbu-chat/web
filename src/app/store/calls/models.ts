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

export interface EndCallActionPayload {
	seconds: number;
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

export enum CallStatus {
	Successfull = 0,
	Cancelled = 1,
	Declined = 2,
	NotAnswered = 3,
}

//Http requests

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

export interface EndCallApiRequest {
	interlocutorId: number;
	seconds: number;
}

export interface CallNotAnsweredApiRequest {
	interlocutorId: number;
}

export interface AcceptCallApiRequest {
	interlocutorId: number;
}
