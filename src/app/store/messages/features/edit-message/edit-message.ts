import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex, getMessage } from 'app/store/messages/selectors';
import { MessagesState } from '../../models';
import { EditMessageActionPayload } from './edit-message-action-payload';

export class EditMessage {
  static get action() {
    return createAction('EDIT_MESSAGE')<EditMessageActionPayload>();
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
