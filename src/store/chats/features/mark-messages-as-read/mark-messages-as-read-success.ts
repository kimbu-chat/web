import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { getChatByIdDraftSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';

import { IMarkMessagesAsReadSuccessActionPayload } from './action-payloads/mark-messages-as-read-success-action-payload';

export class MarkMessagesAsReadSuccess {
  static get action() {
    return createAction(
      'RESET_UNREAD_MESSAGES_COUNT_SUCCESS',
    )<IMarkMessagesAsReadSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof MarkMessagesAsReadSuccess.action>) => {
        const { chatId } = payload;

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.unreadMessagesCount = 0;
        }

        return draft;
      },
    );
  }
}
