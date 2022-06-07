import { createAction } from '@reduxjs/toolkit';

import { IIntercolutorMessageTypingIntegrationEvent } from '@store/chats/socket-events/message-typing/message-typing-event-handler';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';


export type IInterlocutorStoppedTypingActionPayload = IIntercolutorMessageTypingIntegrationEvent;

export class InterlocutorStoppedTyping {
  static get action() {
    return createAction<IInterlocutorStoppedTypingActionPayload>('INTERLOCUTOR_STOPPED_TYPING');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof InterlocutorStoppedTyping.action>) => {
      const { chatId, interlocutorName } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat && chat.typingInterlocutors?.length) {
        chat.typingInterlocutors = chat.typingInterlocutors?.filter(
          (fullName) => fullName !== interlocutorName,
        );
      }
      return draft;
    };
  }
}
