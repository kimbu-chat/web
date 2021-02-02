import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export class ResetReplyToMessage {
  static get action() {
    return createEmptyAction('RESET_REPLY_TO_MESSAGE');
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
