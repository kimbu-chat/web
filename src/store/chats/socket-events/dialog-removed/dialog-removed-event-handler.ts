import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import { IDialogRemovedIntegrationEvent } from './dialog-removed-integration-event';

export class DialogRemovedEventHandler {
  static get action() {
    return createAction('DialogRemoved')<IDialogRemovedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof DialogRemovedEventHandler.action>) => {
        const { userInterlocutorId } = payload;
        const chatId = ChatId.from(userInterlocutorId).id;

        const chatIndex = draft.chatList.chatIds.indexOf(chatId);
        if (chatIndex !== 0) {
          draft.chatList.chatIds.splice(chatIndex, 1);

          delete draft.chats[chatId];
        }

        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = null;
        }

        // TODO: handle user deleteing

        return draft;
      },
    );
  }
}
