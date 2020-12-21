export interface RenegotiationIntegrationEvent {
  userInterlocutorId: number;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
