import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MessageDeletedFromEventReq, MessagesState } from '../../models';
import { getChatIndex, getMessage } from '../../selectors';

export class MessagesDeletedFromEvent {
  static get action() {
    return createAction('MESSAGE_DELETED_FROM_EVENT')<MessageDeletedFromEventReq>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof MessagesDeletedFromEvent.action>) => {
      const chatIndex = getChatIndex(draft, payload.chatId);

      payload.messageIds.forEach((msgIdToDelete) => {
        if (getMessage(draft.messages[chatIndex].messages, msgIdToDelete)?.isSelected) {
          draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== msgIdToDelete);
        }

        draft.messages[chatIndex].messages = draft.messages[chatIndex].messages.filter(({ id }) => id !== msgIdToDelete);
      });
      return draft;
    });
  }
}
