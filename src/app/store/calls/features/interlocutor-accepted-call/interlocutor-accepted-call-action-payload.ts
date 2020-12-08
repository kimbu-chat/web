export interface InterlocutorAcceptedCallActionPayload {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  isRenegotiation?: boolean;
}
