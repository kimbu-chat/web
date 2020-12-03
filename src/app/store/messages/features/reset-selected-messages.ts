import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex } from '../messages-utils';
import { MessagesState, ResetSelectedMessagesReq } from '../models';

export class ResetSelecedMessages {
  static get action() {
    return createAction('RESET_SELECTED_MESSAGES')<ResetSelectedMessagesReq>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof ResetSelecedMessages.action>) => {
      const chatIndex = getChatIndex(draft, payload.chatId as number);

      draft.messages[chatIndex].messages.forEach((message) => {
        message.isSelected = false;
      });
      draft.selectedMessageIds = [];

      return draft;
    });
  }
}
