import { IUserPreview } from 'store/models';

export interface IForwardMessagesSuccessActionPayload {
  messagesToForward: { messageId: number; serverMessageId: number }[];
  chatIdsToForward: number[];
  forwardedChatId: number;
  creationDateTime: Date;
  userCreator: IUserPreview;
}
