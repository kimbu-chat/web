export interface IRenegotiationSentIntegrationEvent {
  userInterlocutorId: number;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
