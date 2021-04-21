import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '@store/chats/selectors';
import { MessageState } from '../../models';
import { ISumbitEditMessageSuccessActionPayload } from './action-payloads/sumbit-edit-message-success-action-payload';
import { IChatsState } from '../../chats-state';

export class SubmitEditMessageSuccess {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE_SUCCESS')<ISumbitEditMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof SubmitEditMessageSuccess.action>) => {
        const { chatId, messageId } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);
        const message = draft.messages[chatId].messages.find(({ id }) => id === messageId);

        if (message) {
          message.state = MessageState.SENT;
        }

        if (chat?.lastMessage) {
          if (chat?.lastMessage.id === messageId) {
            chat.lastMessage.state = MessageState.SENT;
          }
        }

        return draft;
      },
    );
  }
}
