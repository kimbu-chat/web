import { createAction } from '@reduxjs/toolkit';
import {
  AttachmentType,
  IAudioAttachment,
  IPictureAttachment,
  IVideoAttachment,
  IVoiceAttachment,
} from 'kimbu-models';

import { MyProfileService } from '@services/my-profile-service';
import { IChatsState } from '@store/chats/chats-state';
import { INormalizedMessage } from '@store/chats/models';

import { getMessageDraftSelector } from '../../selectors';

import { IMessageCreatedIntegrationEvent } from './message-created-integration-event';


export class MessageCreatedEventHandlerSuccess {
  static get action() {
    return createAction<IMessageCreatedIntegrationEvent & {
        linkedMessage?: INormalizedMessage;
        isNewChat?: boolean;
      }>('MessageCreated_SUCCESS');
  }

  static get reducer() {
    return (
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
          isNewChat,
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
            isInterlocutorCurrentSelectedChat || isCurrentUserMessageCreator || isNewChat
              ? previousUnreadMessagesCount
              : previousUnreadMessagesCount + 1;

          const chatMessages = draft.chats[chatId]?.messages;

          if (chatMessages) {
            chatMessages.messageIds.unshift(message.id);

            chatMessages.messages[message.id] = message;
          }

          // todo: unify
          attachments?.forEach((attachment) => {
            switch (attachment.type) {
              case AttachmentType.Audio:
                chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 0) + 1;
                chat.audios.data.unshift({
                  ...(attachment as IAudioAttachment),
                  creationDateTime: new Date().toISOString(),
                });

                break;
              case AttachmentType.Picture:
                chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 0) + 1;
                chat.photos.data.unshift({
                  ...(attachment as IPictureAttachment),
                  creationDateTime: new Date().toISOString(),
                });

                break;
              case AttachmentType.Raw:
                chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 0) + 1;
                chat.files.data.unshift({
                  ...attachment,
                  creationDateTime: new Date().toISOString(),
                });

                break;
              case AttachmentType.Video:
                chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 0) + 1;
                chat.videos.data.unshift({
                  ...(attachment as IVideoAttachment),
                  creationDateTime: new Date().toISOString(),
                });

                break;
              case AttachmentType.Voice:
                chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 0) + 1;
                chat.recordings.data.unshift({
                  ...(attachment as IVoiceAttachment),
                  creationDateTime: new Date().toISOString(),
                });

                break;
              default:
                break;
            }
          });

          chat.lastMessageId = message.id;
          chat.unreadMessagesCount = newUnreadMessagesCount;

          draft.chatList.chatIds = draft.chatList.chatIds.filter(
            (currentId) => currentId !== chatId,
          );

          draft.chatList.chatIds.unshift(chat.id);
        }

        return draft;
      };
  }
}
