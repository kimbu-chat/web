export interface IRenegotiationSentIntegrationEvent {
  userInterlocutorId: string;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
