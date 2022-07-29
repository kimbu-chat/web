import { createAction } from '@reduxjs/toolkit';
import { AttachmentType } from 'kimbu-models';

import { IChatsState } from '@store/chats/chats-state';
import { INormalizedMessage } from '@store/chats/models';

import { getChatByIdDraftSelector, getChatLastMessageDraftSelector } from '../../selectors';

export interface IMessagesDeletedIntegrationEventHandlerSuccessActionPayload {
  chatId: number;
  messageIds: number[];
  chatNewLastMessage: INormalizedMessage | null;
}

export class MessagesDeletedIntegrationEventHandlerSuccess {
  static get action() {
    return createAction<IMessagesDeletedIntegrationEventHandlerSuccessActionPayload>(
      'MessagesDeletedSuccess',
    );
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof MessagesDeletedIntegrationEventHandlerSuccess.action>,
    ) => {
      const { chatId, messageIds, chatNewLastMessage } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);
      const lastMessage = getChatLastMessageDraftSelector(chatId, draft);
      const messagesForChat = draft.chats[chatId]?.messages;

      if (chat) {
        messageIds.forEach((msgIdToDelete) => {
          draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== msgIdToDelete);

          if (messagesForChat) {
            messagesForChat.messageIds = messagesForChat.messageIds.filter(
              (msgId) => msgIdToDelete !== msgId,
            );
          }

          const deletedMessage = messagesForChat?.messages[msgIdToDelete || -1];

          deletedMessage?.attachments?.forEach((attachment) => {
            switch (attachment.type) {
              case AttachmentType.Audio:
                chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 1) - 1;
                chat.audios.data = chat.audios.data.filter(({ id }) => id !== attachment.id);

                break;
              case AttachmentType.Picture:
                chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 1) - 1;
                chat.photos.data = chat.photos.data.filter(({ id }) => id !== attachment.id);

                break;
              case AttachmentType.Raw:
                chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 1) - 1;
                chat.files.data = chat.files.data.filter(({ id }) => id !== attachment.id);

                break;
              case AttachmentType.Video:
                chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 1) - 1;
                chat.videos.data = chat.videos.data.filter(({ id }) => id !== attachment.id);

                break;
              case AttachmentType.Voice:
                chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 1) - 1;
                chat.recordings.data = chat.recordings.data.filter(
                  ({ id }) => id !== attachment.id,
                );

                break;
              default:
                break;
            }
          });

          messagesForChat?.messageIds
            .filter((messageId) => {
              const linkedMessage = messagesForChat?.messages[messageId]?.linkedMessage;

              return linkedMessage?.id === msgIdToDelete;
            })
            .forEach((_msg, linkedMsgIndex) => {
              const message = messagesForChat?.messages[linkedMsgIndex];

              if (message?.linkedMessage) {
                message.linkedMessage = undefined;
              }

              return message;
            });

          delete messagesForChat?.messages[msgIdToDelete || -1];
        });
        if (messageIds.includes(draft.chats[chatId]?.lastMessageId || -1) && chatNewLastMessage) {
          chat.lastMessageId = chatNewLastMessage.id;
        }

        if (lastMessage?.linkedMessage) {
          if (messageIds.includes(lastMessage?.linkedMessage?.id)) {
            lastMessage.linkedMessage = undefined;
          }
        }
      }

      // TODO: handle user deleteing

      return draft;
    };
  }
}
