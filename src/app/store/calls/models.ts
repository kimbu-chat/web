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

export interface IIncomingCall {
	caller: UserPreview;
	offer: RTCSessionDescriptionInit;
}

export interface IOutgoingCall {
	calling: UserPreview;
	constraints: IConstraints;
}

export interface IAcceptIncomingCall {
	constraints: IConstraints;
}

export interface IInterlocutorAcceptCall {
	answer: RTCSessionDescriptionInit;
}

export interface ICandidateAction {
	candidate: RTCIceCandidate;
}

export interface IGotMediaDevicesInfo {
	kind: 'videoinput' | 'audioinput';
	devices: MediaDeviceInfo[];
}

export interface ISwitchDevice {
	kind: 'videoinput' | 'audioinput';
	deviceId: string;
}

//Http requests

export interface IEndCall {
	interlocutorId: number;
}

export interface ICandidate {
	interlocutorId: number;
	candidate: RTCIceCandidate;
}

export interface ICall {
	interlocutorId: number;
	offer: RTCSessionDescriptionInit;
	caller: UserPreview;
}

export interface ICancelCall {
	interlocutorId: number;
}

export interface IAcceptCall {
	interlocutorId: number;
}
