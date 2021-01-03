import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getMessagesChatIndex, getMessage } from 'app/store/messages/selectors';
import { ISumbitEditMessageSuccessActionPayload } from './sumbit-edit-message-success-action-payload';
import { IMessagesState } from '../../models';

export class SubmitEditMessageSuccess {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE_SUCCESS')<ISumbitEditMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof SubmitEditMessageSuccess.action>) => {
      draft.selectedMessageIds = [];

      const chatIndex = getMessagesChatIndex(draft, payload.chatId);

      const message = getMessage(draft.messages[chatIndex].messages, payload.messageId);

      message!.text = payload.text;
      message!.isEdited = true;
      message!.attachments = [
        ...(message!.attachments?.filter(({ id }) => payload.removedAttachments?.findIndex((removedAttachment) => removedAttachment.id === id) === -1) || []),
        ...(payload.newAttachments || []),
      ];

      return draft;
    });
  }
}
