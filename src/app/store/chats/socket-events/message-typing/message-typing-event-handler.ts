import { IChatsState, InterlocutorType } from 'store/chats/models';
import { ChatId } from 'store/chats/chat-id';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { MyProfileService } from 'app/services/my-profile-service';
import { IIntercolutorMessageTypingIntegrationEvent } from './message-typing-integration-event';
import { getChatByIdDraftSelector } from '../../selectors';

export class UserMessageTypingEventHandler {
  static get action() {
    return createAction('MessageTyping')<IIntercolutorMessageTypingIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UserMessageTypingEventHandler.action>) => {
      const { interlocutorName, chatId, interlocutorId, text } = payload;

      const myId = new MyProfileService().myProfile.id;

      // Chat list uppdate
      if (ChatId.fromId(chatId).interlocutorType === InterlocutorType.GroupChat && interlocutorId === myId) {
        return draft;
      }

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (!chat) {
        return draft;
      }

      clearTimeout(chat.timeoutId as NodeJS.Timeout);

      const timeoutId = (setTimeout(() => {
        // TODO: here we have no acces to store, so we have to do yield put
        // store.dispatch(ChatActions.interlocutorStoppedTyping(action.payload));
      }, 1500) as unknown) as NodeJS.Timeout;

      const typingUser = {
        timeoutId,
        fullName: interlocutorName,
      };

      chat.draftMessage = text;
      chat.timeoutId = timeoutId;

      if (!chat.typingInterlocutors?.find(({ fullName }) => fullName === interlocutorName)) {
        chat.typingInterlocutors = [...(chat.typingInterlocutors || []), typingUser];
      }

      return draft;
    });
  }
}
