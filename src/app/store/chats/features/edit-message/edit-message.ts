import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IEditMessageActionPayload } from './action-payloads/edit-message-action-payload';

export class EditMessage {
  static get action() {
    return createAction('EDIT_MESSAGE')<IEditMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof EditMessage.action>) => {
      const { messageId } = payload;

      const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

      const message = chat?.messages.messages.find(({ id }) => id === messageId);

      if (chat) {
        chat.messageToEdit = message;
        chat.messageToReply = undefined;
      }

      return draft;
    });
  }
}
