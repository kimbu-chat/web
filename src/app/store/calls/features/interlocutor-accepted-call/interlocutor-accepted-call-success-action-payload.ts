export interface InterlocutorAcceptedCallSuccessActionPayload {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  interlocutorId: number;
  isRenegotiation?: boolean;
  myId: number;
}
