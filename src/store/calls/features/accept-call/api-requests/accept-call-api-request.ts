export interface IAcceptCallApiRequest {
  userInterlocutorId: number;
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
}
