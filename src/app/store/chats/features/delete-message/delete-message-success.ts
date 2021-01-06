import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { FileType, IChatsState } from 'app/store/chats/models';
import { IDeleteMessageSuccessActionPayload } from './action-payloads/delete-message-success-action-payload';

export class DeleteMessageSuccess {
  static get action() {
    return createAction('DELETE_MESSAGE_SUCCESS')<IDeleteMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof DeleteMessageSuccess.action>) => {
      const { chatId, messageIds } = payload;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        messageIds.forEach((msgIdToDelete) => {
          draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== msgIdToDelete);
          const messageIndex = chat.messages.messages.findIndex(({ id }) => id === msgIdToDelete);
          const [deletedMessage] = chat.messages.messages.splice(messageIndex, 1);

          console.log(deletedMessage.text);

          deletedMessage.attachments?.forEach((attachment) => {
            switch (attachment.type) {
              case FileType.Audio:
                chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 1) - 1;
                chat.audios.audios.filter(({ id }) => id !== attachment.id);

                break;
              case FileType.Picture:
                chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 1) - 1;
                chat.photos.photos.filter(({ id }) => id !== attachment.id);

                break;
              case FileType.Raw:
                chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 1) - 1;
                chat.files.files.filter(({ id }) => id !== attachment.id);

                break;
              case FileType.Video:
                chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 1) - 1;
                chat.videos.videos.filter(({ id }) => id !== attachment.id);

                break;
              case FileType.Voice:
                chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 1) - 1;
                chat.recordings.recordings.filter(({ id }) => id !== attachment.id);

                break;
              default:
                break;
            }
          });
        });

        if (chat.lastMessage?.id && messageIds.includes(chat.lastMessage.id)) {
          [chat.lastMessage] = chat.messages.messages;
        }
      }

      return draft;
    });
  }
}
