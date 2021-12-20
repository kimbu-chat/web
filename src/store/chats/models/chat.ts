import {
  IGroupChat,
  IAttachmentBase,
  IAudioAttachment,
  IPictureAttachment,
  IVideoAttachment,
  IVoiceAttachment,
} from 'kimbu-models';

import { IPossibleMembers } from '@store/chats/models/possible-members';

import { IAttachmentToSend } from './attachment-to-send';
import { IGroupable } from './groupable';
import { InterlocutorType } from './interlocutor-type';
import { INormalizedMessage } from './normalized-message';

export interface INormalizedRawChat {
  interlocutorType?: InterlocutorType;
  groupChat?: IGroupChat;
  lastMessageId?: number;
  interlocutorId?: number;
  unreadMessagesCount: number;
  interlocutorLastReadMessageId?: number;
  draftMessage?: string;
  typingInterlocutors?: string[];
  isMuted?: boolean;
  isGeneratedLocally?: boolean;
}

export interface INormalizedChat extends INormalizedRawChat{
  id: number;
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
    files: (IAttachmentBase & IGroupable)[];
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
    messages: Record<number, INormalizedMessage>;
    messageIds: number[];
    loading: boolean;
    hasMore: boolean;
    searchString?: string;
  };

  attachmentsToSend?: IAttachmentToSend<IAttachmentBase>[];

  rawAttachmentsCount?: number;
  videoAttachmentsCount?: number;
  voiceAttachmentsCount?: number;
  audioAttachmentsCount?: number;
  pictureAttachmentsCount?: number;

  isBlockedByInterlocutor: boolean;
  isBlockedByUser: boolean;
  isInContacts: boolean;
  isDismissedAddToContacts: boolean;
  possibleMembers: IPossibleMembers;
}
