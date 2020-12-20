export interface InterlocutorAcceptedCallIntegrationEvent {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  userInterlocutorId: number;
}
