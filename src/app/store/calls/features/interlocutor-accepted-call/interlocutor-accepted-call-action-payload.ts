export interface IInterlocutorAcceptedCallActionPayload {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  isRenegotiation?: boolean;
}
