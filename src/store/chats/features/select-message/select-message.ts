import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ISelectMessageActionPayload } from './action-payloads/select-message-action-payload';
import { getMessageDraftSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';

export class SelectMessage {
  static get action() {
    return createAction('SELECT_MESSAGE')<ISelectMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof SelectMessage.action>) => {
      const { messageId } = payload;

      if (draft.selectedChatId) {
        const message = getMessageDraftSelector(draft.selectedChatId, messageId, draft);

        if (message) {
          const isMessageSelected =
            draft.selectedMessageIds.includes(message.id) && message.isSelected;

          if (!isMessageSelected) {
            message.isSelected = true;
            draft.selectedMessageIds.push(payload.messageId);
          } else {
            message.isSelected = false;
            draft.selectedMessageIds = draft.selectedMessageIds.filter(
              (id) => id !== payload.messageId,
            );
          }
        }
      }

      return draft;
    });
  }
}
