export interface IAcceptCallApiRequest {
  userInterlocutorId: number;
  answer: RTCSessionDescription;
  isVideoEnabled: boolean;
}
