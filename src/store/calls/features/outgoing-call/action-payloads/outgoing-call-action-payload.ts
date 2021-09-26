export interface IOutgoingCallActionPayload {
  callingUserId: number;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}
