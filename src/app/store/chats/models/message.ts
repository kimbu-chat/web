import { IUserPreview } from 'app/store/models';
import { MessageLinkType } from './linked-message-type';
import { IBaseAttachment } from './attachments/base-attachment';
import { MessageState } from './message-state';
import { SystemMessageType } from './system-message-type';

export interface IMessage {
  id: number;
  userCreator: IUserPreview;
  creationDateTime: Date;
  text: string;
  attachmentsJson?: string;
  systemMessageType: SystemMessageType;
  state?: MessageState;
  chatId: number;
  dateSeparator?: string;
  isSelected?: boolean;
  needToShowCreator?: boolean;
  needToShowDateSeparator?: boolean;
  isEdited?: boolean;
  attachments?: IBaseAttachment[];
  linkedMessageType?: MessageLinkType;
  linkedMessage?: {
    id: number;
    userCreator: IUserPreview;
    text: string;
    attachments?: IBaseAttachment[];
  } | null;
}
