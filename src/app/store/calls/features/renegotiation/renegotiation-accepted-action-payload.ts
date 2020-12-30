export interface IRenegotiationAcceptedActionPayload {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  isRenegotiation?: boolean;
}
