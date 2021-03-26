import { delay, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { InterlocutorType } from '../../models';
import { ChatId } from '../../chat-id';
import { MyProfileService } from '../../../../services/my-profile-service';
import { IIntercolutorMessageTypingIntegrationEvent } from './message-typing-integration-event';
import { getChatByIdDraftSelector } from '../../selectors';
import { InterlocutorStoppedTyping } from '../../features/interlocutor-message-typing/interlocutor-stopped-typing';
import { IChatsState } from '../../chats-state';

export class UserMessageTypingEventHandler {
  static get action() {
    return createAction('MessageTyping')<IIntercolutorMessageTypingIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (
        draft: IChatsState,
        { payload }: ReturnType<typeof UserMessageTypingEventHandler.action>,
      ) => {
        const { interlocutorName, chatId, interlocutorId, text } = payload;

        const myId = new MyProfileService().myProfile.id;

        // Chat list uppdate
        if (
          ChatId.fromId(chatId).interlocutorType === InterlocutorType.GroupChat &&
          interlocutorId === myId
        ) {
          return draft;
        }

        const chat = getChatByIdDraftSelector(chatId, draft);

        if (!chat) {
          return draft;
        }

        chat.draftMessage = text;

        if (!chat.typingInterlocutors?.find((fullName) => fullName === interlocutorName)) {
          chat.typingInterlocutors = [...(chat.typingInterlocutors || []), interlocutorName];
        }

        return draft;
      },
    );
  }

  static get saga() {
    return function* typingSaga(action: ReturnType<typeof UserMessageTypingEventHandler.action>) {
      yield delay(3000);
      yield put(InterlocutorStoppedTyping.action(action.payload));
    };
  }
}
