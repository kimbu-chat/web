import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ISumbitEditMessageSuccessActionPayload } from './sumbit-edit-message-success-action-payload';
import { getMessageDraftSelector } from '../../selectors';

export class SubmitEditMessageSuccess {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE_SUCCESS')<ISumbitEditMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof SubmitEditMessageSuccess.action>) => {
      const { chatId, messageId } = payload;

      const message = getMessageDraftSelector(chatId, messageId, draft);

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
