export interface InterlocutorAcceptedCallIntegrationEvent {
	answer: RTCSessionDescriptionInit;
	isVideoEnabled: boolean;
}
