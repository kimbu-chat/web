import { IUser } from '@store/common/models';
import { IMessage, INormalizedMessage } from '@store/chats/models/message';

import { IAttachmentToSend } from './attachment-to-send';
import { IAudioAttachment } from './attachments/audio-attachment';
import { IBaseAttachment } from './attachments/base-attachment';
import { IPictureAttachment } from './attachments/picture-atachment';
import { IVideoAttachment } from './attachments/video-attachment';
import { IVoiceAttachment } from './attachments/voice-attachment';
import { IGroupChat } from './group-chat';
import { IGroupable } from './groupable';
import { InterlocutorType } from './interlocutor-type';
import { ById } from './by-id';

export interface IChat {
  id: number;

  groupChat?: IGroupChat;
  lastMessage?: IMessage;
  interlocutor?: IUser;
  unreadMessagesCount: number;
  interlocutorLastReadMessageId?: number;
  isMuted?: boolean;

  isBlockedByInterlocutor: boolean;
  isBlockedByUser: boolean;
  isInContacts: boolean;
  isDismissedAddToContacts: boolean;
}

export interface INormalizedChat {
  id: number;
  interlocutorType?: InterlocutorType;
  groupChat?: IGroupChat;
  lastMessage?: INormalizedMessage | null;
  interlocutorId?: number;
  unreadMessagesCount: number;
  interlocutorLastReadMessageId?: number;
  draftMessage?: string;
  typingInterlocutors?: string[];
  isMuted?: boolean;
  isGeneratedLocally?: boolean;

  messageToEdit?: INormalizedMessage;
  messageToReply?: INormalizedMessage;

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
    files: (IBaseAttachment & IGroupable)[];
    loading: boolean;
    hasMore: boolean;
  };
  members: {
    memberIds: number[];
    loading: boolean;
    hasMore: boolean;
  };
  recordings: {
    recordings: (IVoiceAttachment & IGroupable)[];
    loading: boolean;
    hasMore: boolean;
  };

  messages: {
    messages: ById<INormalizedMessage>;
    messageIds: number[];
    loading: boolean;
    hasMore: boolean;
    searchString?: string;
  };

  attachmentsToSend?: IAttachmentToSend<IBaseAttachment>[];

  rawAttachmentsCount?: number;
  videoAttachmentsCount?: number;
  voiceAttachmentsCount?: number;
  audioAttachmentsCount?: number;
  pictureAttachmentsCount?: number;

  isBlockedByInterlocutor: boolean;
  isBlockedByUser: boolean;
  isInContacts: boolean;
  isDismissedAddToContacts: boolean;
}
