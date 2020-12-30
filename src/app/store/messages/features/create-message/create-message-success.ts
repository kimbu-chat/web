import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex } from 'app/store/messages/selectors';
import { ICreateMessageSuccessActionPayload } from './create-message-success-action-payload';
import { IMessagesState } from '../../models';

export class CreateMessageSuccess {
  static get action() {
    return createAction('CREATE_MESSAGE_SUCCESS')<ICreateMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof CreateMessageSuccess.action>) => {
      const { messageState, chatId, oldMessageId, newMessageId } = payload;
      const chatIndex = getChatIndex(draft, chatId);
      const messageIndex = draft.messages[chatIndex].messages.findIndex((x) => x.id === oldMessageId);
      draft.messages[chatIndex].messages[messageIndex].id = newMessageId;
      draft.messages[chatIndex].messages[messageIndex].state = messageState;

      return draft;
    });
  }
}
