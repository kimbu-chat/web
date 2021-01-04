import { IChatsState } from 'store/chats/models';
import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';

export class ResetReplyToMessage {
  static get action() {
    return createEmptyAction('RESET_REPLY_TO_MESSAGE');
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.messageToReply = undefined;
      return draft;
    });
  }
}
