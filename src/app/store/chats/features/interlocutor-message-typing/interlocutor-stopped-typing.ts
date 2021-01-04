import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IInterlocutorStoppedTypingActionPayload } from './interlocutor-stopped-typing-action-payload';

export class InterlocutorStoppedTyping {
  static get action() {
    return createAction('INTERLOCUTOR_STOPPED_TYPING')<IInterlocutorStoppedTypingActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof InterlocutorStoppedTyping.action>) => {
      const { chatId, interlocutorName } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.timeoutId = undefined;
        chat.typingInterlocutors = chat.typingInterlocutors?.filter((user) => user.fullName !== interlocutorName);
      }
      return draft;
    });
  }
}
