import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { checkChatExists, getChatArrayIndex } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IInterlocutorMessageTypingActionPayload } from './interlocutor-message-typing-action-payload';

export class InterlocutorMessageTyping {
  static get action() {
    return createAction('INTERLOCUTOR_MESSAGE_TYPING_EVENT')<IInterlocutorMessageTypingActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof InterlocutorMessageTyping.action>) => {
      const { chatId, interlocutorName, timeoutId } = payload;

      const isChatExists: boolean = checkChatExists(chatId, draft);

      if (!isChatExists) {
        return draft;
      }

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      clearTimeout(draft.chats[chatIndex].timeoutId as NodeJS.Timeout);

      const typingUser = {
        timeoutId,
        fullName: interlocutorName,
      };

      draft.chats[chatIndex].draftMessage = payload.text;
      draft.chats[chatIndex].timeoutId = timeoutId;

      if (!draft.chats[chatIndex].typingInterlocutors?.find(({ fullName }) => fullName === interlocutorName)) {
        draft.chats[chatIndex].typingInterlocutors = [...(draft.chats[chatIndex].typingInterlocutors || []), typingUser];
      }

      return draft;
    });
  }
}
