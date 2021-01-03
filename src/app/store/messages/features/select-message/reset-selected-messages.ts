import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getMessagesChatIndex } from 'app/store/messages/selectors';
import { IMessagesState } from '../../models';
import { IResetSelectedMessagesActionPayload } from './reset-selected-messages-action-payload';

export class ResetSelectedMessages {
  static get action() {
    return createAction('RESET_SELECTED_MESSAGES')<IResetSelectedMessagesActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof ResetSelectedMessages.action>) => {
      const chatIndex = getMessagesChatIndex(draft, payload.chatId as number);

      draft.messages[chatIndex].messages.forEach((message) => {
        message.isSelected = false;
      });
      draft.selectedMessageIds = [];

      return draft;
    });
  }
}
