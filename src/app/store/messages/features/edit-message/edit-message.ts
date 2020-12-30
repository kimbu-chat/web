import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex, getMessage } from 'app/store/messages/selectors';
import { IMessagesState } from '../../models';
import { IEditMessageActionPayload } from './edit-message-action-payload';

export class EditMessage {
  static get action() {
    return createAction('EDIT_MESSAGE')<IEditMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof EditMessage.action>) => {
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
