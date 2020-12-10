export interface InterlocutorAcceptedCallIntegrationEvent {
  answer: RTCSessionDescriptionInit;
  interlocutorId: number;
  isRenegociation: boolean;
  isVideoEnabled: boolean;
}
