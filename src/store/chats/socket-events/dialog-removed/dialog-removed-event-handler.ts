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

        draft.chatList.chatIds = draft.chatList.chatIds.filter((id) => id !== chatId);
        delete draft.chats[chatId];

        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = undefined;
        }

        // TODO: handle user deleteing

        return draft;
      },
    );
  }
}
