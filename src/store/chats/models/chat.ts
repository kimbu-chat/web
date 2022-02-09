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
import { InterlocutorType } from './interlocutor-type';
import { IMediaFileList } from './media-file-list';
import { INormalizedMessage } from './normalized-message';

export interface INormalizedChat {
  id: number;

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

  messageToEdit?: INormalizedMessage;
  messageToReply?: INormalizedMessage;

  photos: IMediaFileList<IPictureAttachment>;
  videos: IMediaFileList<IVideoAttachment>;
  audios: IMediaFileList<IAudioAttachment>;
  files: IMediaFileList<IAttachmentBase>;
  recordings: IMediaFileList<IVoiceAttachment>;
  members: {
    memberIds: number[];
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
