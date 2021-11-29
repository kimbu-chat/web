import produce from 'immer';
import { AttachmentType } from 'kimbu-models';
import { createAction } from 'typesafe-actions';

import { IChatsState } from '@store/chats/chats-state';

import { getChatByIdDraftSelector } from '../../selectors';

import { IMessagesDeletedIntegrationEventHandlerSuccessActionPayload } from './action-payloads/messages-deleted-integration-event-handler-success-action-payload';

export class MessagesDeletedIntegrationEventHandlerSuccess {
  static get action() {
    return createAction(
      'MessagesDeletedSuccess',
    )<IMessagesDeletedIntegrationEventHandlerSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (
        draft: IChatsState,
        { payload }: ReturnType<typeof MessagesDeletedIntegrationEventHandlerSuccess.action>,
      ) => {
        const { chatId, messageIds, chatNewLastMessage } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);
        const messagesForChat = draft.chats[chatId]?.messages;

        if (chat) {
          messageIds.forEach((msgIdToDelete) => {
            draft.selectedMessageIds = draft.selectedMessageIds.filter(
              (id) => id !== msgIdToDelete,
            );

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
                  chat.audios.audios = chat.audios.audios.filter(({ id }) => id !== attachment.id);

                  break;
                case AttachmentType.Picture:
                  chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 1) - 1;
                  chat.photos.photos = chat.photos.photos.filter(({ id }) => id !== attachment.id);

                  break;
                case AttachmentType.Raw:
                  chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 1) - 1;
                  chat.files.files = chat.files.files.filter(({ id }) => id !== attachment.id);

                  break;
                case AttachmentType.Video:
                  chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 1) - 1;
                  chat.videos.videos = chat.videos.videos.filter(({ id }) => id !== attachment.id);

                  break;
                case AttachmentType.Voice:
                  chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 1) - 1;
                  chat.recordings.recordings = chat.recordings.recordings.filter(
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
          if (messageIds.includes(draft.chats[chatId]?.lastMessage?.id || -1)) {
            chat.lastMessage = chatNewLastMessage;
          }

          if (chat.lastMessage?.linkedMessage) {
            if (messageIds.includes(chat.lastMessage?.linkedMessage?.id)) {
              chat.lastMessage.linkedMessage = undefined;
            }
          }
        }

        // TODO: handle user deleteing

        return draft;
      },
    );
  }
}
