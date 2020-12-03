import { IntercolutorMessageTypingIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/interlocutor-message-typing-integration-event';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { checkChatExists, getChatArrayIndex } from '../chats-utils';
import { ChatsState } from '../models';

export class InterlocutorStoppedTyping {
  static get action() {
    return createAction('INTERLOCUTOR_STOPPED_TYPING')<IntercolutorMessageTypingIntegrationEvent>();
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
