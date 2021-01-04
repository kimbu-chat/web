export interface IOutgoingCallApiRequest {
  userInterlocutorId: number;
  offer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}
