export interface InterlocutorAcceptedCallSuccessActionPayload {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  isRenegotiation?: boolean;
}
