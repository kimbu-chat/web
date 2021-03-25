import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export class ResetEditMessage {
  static get action() {
    return createEmptyAction('RESET_EDIT_MESSAGE');
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.messageToEdit = undefined;
        }
      }

      return draft;
    });
  }
}
