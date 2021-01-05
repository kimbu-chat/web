import { IUserPreview } from 'app/store/my-profile/models';
import { IBaseAttachment } from './attachments/base-attachment';
import { MessageState } from './message-state';
import { SystemMessageType } from './system-message-type';

export interface IMessage {
  id: number;
  needToShowCreator?: boolean;
  isEdited?: boolean;
  userCreator: IUserPreview;
  creationDateTime: Date;
  text: string;
  attachmentsJson?: string;
  systemMessageType: SystemMessageType;
  state?: MessageState;
  chatId: number;
  dateSeparator?: string;
  isSelected?: boolean;
  needToShowDateSeparator?: boolean;
  attachments?: IBaseAttachment[];
}
