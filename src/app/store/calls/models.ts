import { UserPreview } from '../my-profile/models';

export interface IIncomingCall {
	caller: UserPreview;
}

export interface IOutgoingCall {
	calling: UserPreview;
	offer: RTCSessionDescriptionInit;
}

export interface ICancelCall {
	interlocutor: UserPreview;
}

export interface IAcceptCall {
	interlocutor: UserPreview;
	answer: RTCSessionDescriptionInit;
}

export interface ICancelCall {
	interlocutor: UserPreview;
}

export interface ICallEnded {
	interlocutor: UserPreview;
}

export interface ICandidateAction {
	candidate: RTCIceCandidate;
}
