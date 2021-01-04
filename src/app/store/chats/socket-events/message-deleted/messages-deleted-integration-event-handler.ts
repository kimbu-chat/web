import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../models';
import { getChatByIdDraftSelector } from '../../selectors';
import { IMessagesDeletedIntegrationEvent } from './messages-deleted-integration-event';

export class MessagesDeletedIntegrationEventHandler {
  static get action() {
    return createAction('MessagesDeleted')<IMessagesDeletedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MessagesDeletedIntegrationEventHandler.action>) => {
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
