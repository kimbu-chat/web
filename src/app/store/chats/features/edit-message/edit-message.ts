import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getMessageDraftSelector } from '../../selectors';
import { IEditMessageActionPayload } from './edit-message-action-payload';

export class EditMessage {
  static get action() {
    return createAction('EDIT_MESSAGE')<IEditMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof EditMessage.action>) => {
      const { messageId } = payload;

      draft.selectedMessageIds = [];

      const message = getMessageDraftSelector(draft.selectedChatId, messageId, draft);

      message!.isSelected = false;

      draft.messageToEdit = message;
      draft.messageToReply = undefined;

      return draft;
    });
  }
}
