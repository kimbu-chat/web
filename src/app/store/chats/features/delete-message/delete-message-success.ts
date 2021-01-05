import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from 'app/store/chats/models';
import { IDeleteMessageSuccessActionPayload } from './action-payloads/delete-message-success-action-payload';

export class DeleteMessageSuccess {
  static get action() {
    return createAction('DELETE_MESSAGE_SUCCESS')<IDeleteMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof DeleteMessageSuccess.action>) => {
      const { chatId, messageIds } = payload;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        messageIds.forEach((msgIdToDelete) => {
          draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== msgIdToDelete);

          chat.messages.messages = chat.messages.messages.filter(({ id }) => id !== msgIdToDelete);
        });

        if (chat.lastMessage?.id && messageIds.includes(chat.lastMessage.id)) {
          [chat.lastMessage] = chat.messages.messages;
        }
      }

      return draft;
    });
  }
}
