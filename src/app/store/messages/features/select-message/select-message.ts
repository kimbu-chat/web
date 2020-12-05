import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex } from 'app/store/messages/selectors';
import { Message, MessagesState, SelectMessageReq } from '../../models';

export class SelectMessage {
  static get action() {
    return createAction('SELECT_MESSAGE')<SelectMessageReq>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof SelectMessage.action>) => {
      const chatIndex = getChatIndex(draft, payload.chatId as number);
      const selectedMessage = draft.messages[chatIndex].messages.find(({ id }) => id === payload.messageId) as Message;
      const isMessageSelected = draft.selectedMessageIds.includes(selectedMessage?.id as number) && selectedMessage?.isSelected;

      if (!isMessageSelected) {
        selectedMessage.isSelected = true;
        draft.selectedMessageIds.push(payload.messageId);
      } else {
        selectedMessage.isSelected = false;
        draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== payload.messageId);
      }

      return draft;
    });
  }
}
