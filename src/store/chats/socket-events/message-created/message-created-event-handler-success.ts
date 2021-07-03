import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { MyProfileService } from '@services/my-profile-service';
import { IChatsState } from '@store/chats/chats-state';
import { INormalizedLinkedMessage } from '@store/chats/models/linked-message';

import {
  FileType,
  IAudioAttachment,
  IPictureAttachment,
  IVideoAttachment,
  IVoiceAttachment,
  INormalizedMessage,
} from '../../models';
import { getMessageDraftSelector } from '../../selectors';

import { IMessageCreatedIntegrationEvent } from './message-created-integration-event';

export class MessageCreatedEventHandlerSuccess {
  static get action() {
    return createAction('MessageCreated_SUCCESS')<
      IMessageCreatedIntegrationEvent & { linkedMessage?: INormalizedLinkedMessage }
    >();
  }

  static get reducer() {
    return produce(
      (
        draft: IChatsState,
        { payload }: ReturnType<typeof MessageCreatedEventHandlerSuccess.action>,
      ) => {
        const {
          attachments,
          chatId,
          creationDateTime,
          id,
          systemMessageType,
          text,
          userCreator,
          linkedMessageId,
          linkedMessage,
          linkedMessageType,
          clientId,
        } = payload;

        const messageExists =
          getMessageDraftSelector(chatId, id, draft) ||
          getMessageDraftSelector(chatId, clientId, draft);

        if (messageExists) {
          return draft;
        }

        const myId = new MyProfileService().myProfile.id;
        const isCurrentUserMessageCreator: boolean = myId === userCreator?.id;

        const message: INormalizedMessage = {
          attachments,
          chatId,
          creationDateTime,
          id,
          systemMessageType,
          text,
          userCreatorId: userCreator.id,
          linkedMessageType,

          isEdited: false,
          isDeleted: false,
        };

        const chat = draft.chats[chatId];

        if (linkedMessage && linkedMessageId) {
          message.linkedMessage = {
            ...linkedMessage,
            userCreatorId: linkedMessage.userCreatorId,
          };
        }

        if (chat) {
          const isInterlocutorCurrentSelectedChat = draft.selectedChatId === message.chatId;
          const previousUnreadMessagesCount = chat.unreadMessagesCount;
          const newUnreadMessagesCount =
            isInterlocutorCurrentSelectedChat || isCurrentUserMessageCreator
              ? previousUnreadMessagesCount
              : previousUnreadMessagesCount + 1;
          const chatMessages = draft.chats[chatId]?.messages;

          if (chatMessages) {
            chatMessages.messageIds.unshift(message.id);

            chatMessages.messages[message.id] = message;
          }

          attachments?.forEach((attachment) => {
            switch (attachment.type) {
              case FileType.Audio:
                chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 0) + 1;
                chat.audios.audios.unshift({
                  ...(attachment as IAudioAttachment),
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Picture:
                chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 0) + 1;
                chat.photos.photos.unshift({
                  ...(attachment as IPictureAttachment),
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Raw:
                chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 0) + 1;
                chat.files.files.unshift({
                  ...attachment,
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Video:
                chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 0) + 1;
                chat.videos.videos.unshift({
                  ...(attachment as IVideoAttachment),
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Voice:
                chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 0) + 1;
                chat.recordings.recordings.unshift({
                  ...(attachment as IVoiceAttachment),
                  creationDateTime: new Date(),
                });

                break;
              default:
                break;
            }
          });

          chat.lastMessage = message;
          chat.unreadMessagesCount = newUnreadMessagesCount;
          chat.draftMessage = '';

          draft.chatList.chatIds = draft.chatList.chatIds.filter(
            (currentId) => currentId !== chatId,
          );

          draft.chatList.chatIds.unshift(chat.id);
        }

        return draft;
      },
    );
  }
}
