export interface IInterlocutorAcceptedCallIntegrationEvent {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  userInterlocutorId: number;
}
