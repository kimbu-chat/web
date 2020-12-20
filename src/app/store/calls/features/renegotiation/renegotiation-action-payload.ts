export interface RenegotiationActionPayload {
  userInterlocutorId: number;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
