import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex, getMessage } from '../messages-utils';
import { EditMessageReq, MessagesState } from '../models';

export class EditMessage {
  static get action() {
    return createAction('EDIT_MESSAGE')<EditMessageReq>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof EditMessage.action>) => {
      draft.selectedMessageIds = [];

      const chatIndex = getChatIndex(draft, payload.chatId);

      const message = getMessage(draft.messages[chatIndex].messages, payload.messageId);

      message!.isSelected = false;

      draft.messageToEdit = message;
      draft.messageToReply = undefined;

      return draft;
    });
  }
}
