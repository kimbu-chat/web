import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { INormalizedMessage } from '@store/chats/models';

import { IChatsState } from '../../chats-state';


export class CreateDraftMessage {
  static get action() {
    return createAction('CREATE_DRAFT_MESSAGE')<INormalizedMessage>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload: message }: ReturnType<typeof CreateDraftMessage.action>) => {
        const chat = draft.chats[message.chatId];
        const chatMessages = chat?.messages;
        chatMessages.messages[message.id] = message;
        chat.draftMessageId = message.id;

        return draft;
      },
    );
  }
}
