export interface IRenegotiationActionPayload {
  userInterlocutorId: number;
  isVideoEnabled: boolean;
  offer: RTCSessionDescriptionInit;
}
