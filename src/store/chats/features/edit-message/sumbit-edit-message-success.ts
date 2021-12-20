import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { MessageState } from '@store/chats/models';

import { IChatsState } from '../../chats-state';

import { ISumbitEditMessageSuccessActionPayload } from './action-payloads/sumbit-edit-message-success-action-payload';

export class SubmitEditMessageSuccess {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE_SUCCESS')<ISumbitEditMessageSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof SubmitEditMessageSuccess.action>) => {
        const { chatId, messageId } = payload;

        const message = draft.chats[chatId]?.messages.messages[messageId];

        if (message) {
          message.state = MessageState.SENT;
        }

        return draft;
      },
    );
  }
}
