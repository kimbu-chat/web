export interface RenegotiationAcceptedIntegrationEvent {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  userInterlocutorId: number;
}
