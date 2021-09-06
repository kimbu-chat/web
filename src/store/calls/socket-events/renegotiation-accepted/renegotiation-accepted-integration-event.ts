export interface IRenegotiationAcceptedIntegrationEvent {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  userInterlocutorId: string;
}
