import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IInterlocutorStoppedTypingActionPayload } from './action-payloads/interlocutor-stopped-typing-action-payload';
import { IChatsState } from '../../chats-state';

export class InterlocutorStoppedTyping {
  static get action() {
    return createAction('INTERLOCUTOR_STOPPED_TYPING')<IInterlocutorStoppedTypingActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof InterlocutorStoppedTyping.action>) => {
      const { chatId, interlocutorName } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.typingInterlocutors = chat.typingInterlocutors?.filter((fullName) => fullName !== interlocutorName);
      }
      return draft;
    });
  }
}
