import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex, getMessage } from '../../messages-utils';
import { MessagesState, SubmitEditMessageReq } from '../../models';

export class SubmitEditMessageSuccess {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE_SUCCESS')<SubmitEditMessageReq>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof SubmitEditMessageSuccess.action>) => {
      draft.selectedMessageIds = [];

      const chatIndex = getChatIndex(draft, payload.chatId);

      const message = getMessage(draft.messages[chatIndex].messages, payload.messageId);

      message!.text = payload.text;
      message!.attachments = [
        ...(message!.attachments?.filter(({ id }) => payload.removedAttachments?.findIndex((removedAttachment) => removedAttachment.id === id) === -1) || []),
        ...(payload.newAttachments || []),
      ];

      return draft;
    });
  }
}
