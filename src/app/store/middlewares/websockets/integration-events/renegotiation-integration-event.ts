export interface IRenegotiationIntegrationEvent {
  userInterlocutorId: number;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
