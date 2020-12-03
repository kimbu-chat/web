import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../chats-utils';
import { UploadAttachmentReqData, ChatsState, AttachmentToSend, BaseAttachment } from '../models';

export class UploadAttachmentRequest {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_REQUEST')<UploadAttachmentReqData>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof UploadAttachmentRequest.action>) => {
      const { type, chatId, attachmentId, file } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          draft.chats[chatIndex].attachmentsToSend = [];
        }

        const attachmentToAdd: AttachmentToSend<BaseAttachment> = {
          attachment: {
            id: attachmentId,
            byteSize: file.size,
            creationDateTime: new Date(),
            url: '',
            type,
          },
          progress: 0,
          fileName: file.name,
          file,
        };

        draft.chats[chatIndex].attachmentsToSend?.push(attachmentToAdd);
      }
      return draft;
    });
  }
}
