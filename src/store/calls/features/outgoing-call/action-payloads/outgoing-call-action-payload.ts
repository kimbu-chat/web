export interface IOutgoingCallActionPayload {
  callingUserId: string;
  constraints: {
    videoEnabled: boolean;
    audioEnabled: boolean;
  };
}
