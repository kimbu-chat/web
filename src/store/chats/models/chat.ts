import { IUser } from '../../common/models';
import { IAttachmentToSend } from './attachment-to-send';
import { IAudioAttachment } from './attachments/audio-attachment';
import { IBaseAttachment } from './attachments/base-attachment';
import { IPictureAttachment } from './attachments/picture-atachment';
import { IRawAttachment } from './attachments/raw-attachment';
import { IVideoAttachment } from './attachments/video-attachment';
import { IVoiceAttachment } from './attachments/voice-attachment';
import { IGroupChat } from './group-chat';
import { IGroupable } from './groupable';
import { InterlocutorType } from './interlocutor-type';
import { IMessage } from './message';
import { UserRelationshipsType } from './relationship-type';

export interface IChat {
  id: number;

  interlocutorType?: InterlocutorType;
  groupChat?: IGroupChat;
  lastMessage?: IMessage | null;
  interlocutor?: IUser;
  unreadMessagesCount: number;
  interlocutorLastReadMessageId?: number;
  draftMessage?: string;
  typingInterlocutors?: string[];
  isMuted?: boolean;

  messageToEdit?: IMessage;
  messageToReply?: IMessage;

  photos: {
    photos: (IPictureAttachment & IGroupable)[];
    loading: boolean;
    hasMore: boolean;
  };
  videos: {
    videos: (IVideoAttachment & IGroupable)[];
    loading: boolean;
    hasMore: boolean;
  };
  audios: {
    audios: (IAudioAttachment & IGroupable)[];
    loading: boolean;
    hasMore: boolean;
  };
  files: {
    files: (IRawAttachment & IGroupable)[];
    loading: boolean;
    hasMore: boolean;
  };
  members: {
    members: IUser[];
    loading: boolean;
    hasMore: boolean;
  };
  recordings: {
    recordings: (IVoiceAttachment & IGroupable)[];
    loading: boolean;
    hasMore: boolean;
  };

  attachmentsToSend?: IAttachmentToSend<IBaseAttachment>[];

  rawAttachmentsCount?: number;
  videoAttachmentsCount?: number;
  voiceAttachmentsCount?: number;
  audioAttachmentsCount?: number;
  pictureAttachmentsCount?: number;

  isBlockedByInterlocutor: boolean;
  isDismissedAddToContacts: boolean;
  relationshipType?: UserRelationshipsType;
}
