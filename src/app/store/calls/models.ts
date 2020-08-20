import { UserPreview } from '../my-profile/models';

export interface IConstraints {
	video:
		| boolean
		| {
				width: { min: number; ideal: number; max: number };
				height: { min: number; ideal: number; max: number };
		  };
	audio: boolean;
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

export interface IMyCandidateAction {
	interlocutorId: number;
	candidate: RTCIceCandidate;
}
