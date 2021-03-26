export interface IRenegociateApiRequest {
  interlocutorId: number;
  offer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}
