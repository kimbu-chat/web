export interface IChangeChatMutedStatusApiRequest {
  chatIds: (number | undefined)[];
  isMuted: boolean;
}
