import { IAttachmentCreation } from 'app/store/chats/models';

export interface ISubmitEditMessageApiRequest {
  text: string;
  messageId: number;
  removedAttachments?: IAttachmentCreation[];
  newAttachments?: IAttachmentCreation[];
}
