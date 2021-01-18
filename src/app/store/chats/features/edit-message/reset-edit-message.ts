import { IChatsState } from 'store/chats/models';
import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
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
          chat.messageToReply = undefined;
        }
      }

      return draft;
    });
  }
}
