import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getMessagesChatIndex } from 'app/store/messages/selectors';
import { IMessage, IMessagesState } from '../../models';
import { ISelectMessageActionPayload } from './select-message-action-payload';

export class SelectMessage {
  static get action() {
    return createAction('SELECT_MESSAGE')<ISelectMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof SelectMessage.action>) => {
      const chatIndex = getMessagesChatIndex(draft, payload.chatId as number);
      const selectedMessage = draft.messages[chatIndex].messages.find(({ id }) => id === payload.messageId) as IMessage;
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
