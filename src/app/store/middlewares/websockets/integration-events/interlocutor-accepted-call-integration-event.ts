export interface InterlocutorAcceptedCallIntegrationEvent {
  answer: RTCSessionDescriptionInit;
  interlocutorId: number;
  isRenegotiation: boolean;
  isVideoEnabled: boolean;
}
