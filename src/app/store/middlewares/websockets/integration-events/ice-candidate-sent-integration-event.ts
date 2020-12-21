export interface IceCandidateSentIntegrationEvent {
  candidate: RTCIceCandidate;
  interlocutorId: number;
  isVideoEnabled: boolean;
}
