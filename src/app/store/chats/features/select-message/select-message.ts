import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ISelectMessageActionPayload } from './select-message-action-payload';
import { getMessageDraftSelector } from '../../selectors';

export class SelectMessage {
  static get action() {
    return createAction('SELECT_MESSAGE')<ISelectMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof SelectMessage.action>) => {
      const { messageId } = payload;

      const message = getMessageDraftSelector(draft.selectedChatId, messageId, draft);

      if (message) {
        const isMessageSelected = draft.selectedMessageIds.includes(message.id as number) && message.isSelected;

        if (!isMessageSelected) {
          message.isSelected = true;
          draft.selectedMessageIds.push(payload.messageId);
        } else {
          message.isSelected = false;
          draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== payload.messageId);
        }
      }

      return draft;
    });
  }
}
