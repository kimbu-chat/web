import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { checkChatExists, getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { InterlocutorStoppedTypingActionPayload } from './interlocutor-stopped-typing-action-payload';

export class InterlocutorStoppedTyping {
  static get action() {
    return createAction('INTERLOCUTOR_STOPPED_TYPING')<InterlocutorStoppedTypingActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof InterlocutorStoppedTyping.action>) => {
      const { chatId, interlocutorName } = payload;

      const isChatExists: boolean = checkChatExists(chatId, draft);

      if (!isChatExists) {
        return draft;
      }

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      draft.chats[chatIndex].timeoutId = undefined;
      draft.chats[chatIndex].typingInterlocutors = draft.chats[chatIndex].typingInterlocutors?.filter((user) => user.fullName !== interlocutorName);

      return draft;
    });
  }
}
