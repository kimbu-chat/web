import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { RootState } from 'store/root-reducer';
import { IChatsState, InterlocutorType } from 'store/chats/models';
import { ChatId } from 'store/chats/chat-id';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { SetStore } from 'app/store/set-store';
import { IntercolutorMessageTypingIntegrationEvent } from './message-typing-integration-event';
import { getChatListChatIndex } from '../../selectors';

export class UserMessageTypingEventHandler {
  static get action() {
    return createAction('MessageTyping')<IntercolutorMessageTypingIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof UserMessageTypingEventHandler.action>): SagaIterator {
      const { interlocutorName, chatId } = action.payload;
      const myId = yield select(getMyIdSelector);

      // Chat list uppdate
      if (ChatId.fromId(action.payload.chatId).interlocutorType === InterlocutorType.GROUP_CHAT && action.payload.interlocutorId === myId) {
        return;
      }

      const timeoutId = (setTimeout(() => {
        // TODO: here we have no acces to store, so we have to do yield put
        // store.dispatch(ChatActions.interlocutorStoppedTyping(action.payload));
      }, 1500) as unknown) as NodeJS.Timeout;

      const state: RootState = yield select();
      const nextState = produce(state, (draft) => {
        const chatListIndex: number = getChatListChatIndex(chatId, draft.chats as IChatsState);

        if (chatListIndex === -1) {
          return draft;
        }

        clearTimeout(draft.chats.chats[chatListIndex].timeoutId as NodeJS.Timeout);

        const typingUser = {
          timeoutId,
          fullName: interlocutorName,
        };

        draft.chats.chats[chatListIndex].draftMessage = action.payload.text;
        draft.chats.chats[chatListIndex].timeoutId = timeoutId;

        if (!draft.chats.chats[chatListIndex].typingInterlocutors?.find(({ fullName }) => fullName === interlocutorName)) {
          draft.chats.chats[chatListIndex].typingInterlocutors = [...(draft.chats.chats[chatListIndex].typingInterlocutors || []), typingUser];
        }

        return draft;
      });

      yield put(SetStore.action(nextState as RootState));
    };
  }
}
