import { IAttachmentBase } from 'kimbu-models';

export interface INormalizedLinkedMessage {
  id: string;
  userCreatorId: number;
  text?: string;
  attachments?: IAttachmentBase[];
  isEdited?: boolean;
  isDeleted?: boolean;
}
