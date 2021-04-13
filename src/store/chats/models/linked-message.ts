import { IUser } from '@store/common/models';
import { IBaseAttachment } from './attachments';

export interface ILinkedMessage {
  id: number;
  userCreator: IUser;
  text?: string;
  attachments?: IBaseAttachment[];
  isEdited?: boolean;
  isDeleted?: boolean;
}
