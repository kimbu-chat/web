export interface IOutgoingCallActionPayload {
  callingId: number;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}
