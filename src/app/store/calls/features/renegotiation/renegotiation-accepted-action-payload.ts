export interface RenegotiationAcceptedActionPayload {
  answer: RTCSessionDescriptionInit;
  isVideoEnabled: boolean;
  isRenegotiation?: boolean;
}
