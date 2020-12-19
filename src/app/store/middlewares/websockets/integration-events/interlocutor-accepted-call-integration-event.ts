export interface InterlocutorAcceptedCallIntegrationEvent {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  userCallerId: number;
  userCalleeId: number;
}
