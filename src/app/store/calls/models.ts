import { Page } from '../common/models';
import { UserPreview } from '../my-profile/models';

export enum CallStatus {
	Successfull = 'Successfull',
	Missed = 'Missed',
	Declined = 'Declined',
	Cancelled = 'Cancelled',
	NotAnswered = 'NotAnswered',
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
export interface IInCompleteConstraints {
	video?: {
		isOpened: boolean;
		width?: { min: number; ideal: number; max: number };
		height?: { min: number; ideal: number; max: number };
		deviceId?: string;
	};
	audio?: {
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
	constraints: {
		videoEnabled: boolean;
		audioEnabled: boolean;
	};
}

export interface AcceptIncomingCallActionPayload {
	constraints: {
		videoEnabled: boolean;
		audioEnabled: boolean;
	};
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
	callerId: number;
	calleeId: number;
	seconds: number;
}

export interface CallNotAnsweredApiRequest {
	interlocutorId: number;
}

export interface AcceptCallApiRequest {
	interlocutorId: number;
}

export interface GetCallsActionData {
	page: Page;
}

export interface Call {
	userInterlocutor: UserPreview;
	seconds: number;
	status: CallStatus;
	id: number;
	callDateTime: Date;
}

export interface CallList {
	calls: Array<Call>;
	hasMore: boolean;
}

export interface GetCallsResponse extends CallList {}

export interface GetCallsApiRequest {
	page: Page;
}
