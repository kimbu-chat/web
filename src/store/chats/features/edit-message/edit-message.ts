import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';
import { IEditMessageActionPayload } from './action-payloads/edit-message-action-payload';

export class EditMessage {
  static get action() {
    return createAction('EDIT_MESSAGE')<IEditMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof EditMessage.action>) => {
      const { messageId } = payload;

      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        const message = draft.messages[draft.selectedChatId]?.messages[messageId];

        if (chat && chat.messageToEdit?.id !== message?.id) {
          chat.messageToEdit = message;
          chat.messageToReply = undefined;
        }
      }

      return draft;
    });
  }
}
