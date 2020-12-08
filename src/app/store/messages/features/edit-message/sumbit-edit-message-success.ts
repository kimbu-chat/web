import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex, getMessage } from 'app/store/messages/selectors';
import { SumbitEditMessageSuccessActionPayload } from './sumbit-edit-message-success-action-payload';
import { MessagesState } from '../../models';

export class SubmitEditMessageSuccess {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE_SUCCESS')<SumbitEditMessageSuccessActionPayload>();
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
