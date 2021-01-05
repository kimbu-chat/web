export interface IChangeChatVisibilityStateApiRequest {
  chatIds: (number | undefined)[];
  isHidden: boolean;
}
