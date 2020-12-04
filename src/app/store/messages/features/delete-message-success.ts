import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex, getMessage } from '../messages-utils';
import { DeleteMessageReq, MessagesState } from '../models';

export class DeleteMessageSuccess {
  static get action() {
    return createAction('DELETE_MESSAGE_SUCCESS')<DeleteMessageReq>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof DeleteMessageSuccess.action>) => {
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
