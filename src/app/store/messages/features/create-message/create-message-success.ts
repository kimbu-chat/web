import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex } from 'app/store/messages/selectors';
import { CreateMessageSuccessActionPayload } from './create-message-success-action-payload';
import { MessagesState } from '../../models';

export class CreateMessageSuccess {
  static get action() {
    return createAction('CREATE_MESSAGE_SUCCESS')<CreateMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof CreateMessageSuccess.action>) => {
      const { messageState, chatId, oldMessageId, newMessageId } = payload;
      const chatIndex = getChatIndex(draft, chatId);
      const messageIndex = draft.messages[chatIndex].messages.findIndex((x) => x.id === oldMessageId);
      draft.messages[chatIndex].messages[messageIndex].id = newMessageId;
      draft.messages[chatIndex].messages[messageIndex].state = messageState;

      return draft;
    });
  }
}
