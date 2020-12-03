import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { MessagesState } from '../models';

export class ResetReplyToMessage {
  static get action() {
    return createEmptyAction('RESET_REPLY_TO_MESSAGE');
  }

  static get reducer() {
    return produce((draft: MessagesState) => {
      draft.messageToReply = undefined;
      return draft;
    });
  }
}
