import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { SetStore } from 'app/store/set-store';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { RootState } from 'store/root-reducer';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../models';
import { getChatListChatIndex } from '../../selectors';
import { IMemberLeftGroupChatIntegrationEvent } from './member-left-group-chat-integration-event';

export class MemberLeftGroupChatEventHandler {
  static get action() {
    return createAction('MemberLeftGroupChat')<IMemberLeftGroupChatIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof MemberLeftGroupChatEventHandler.action>): SagaIterator {
      const myId = yield select(getMyIdSelector);

      const { groupChatId, userId } = action.payload;
      const isCurrentUserEventCreator = myId === userId;

      const state: RootState = yield select();

      const nextState = produce(state, (draft) => {
        const chatId = ChatId.from(undefined, groupChatId).id;

        if (isCurrentUserEventCreator) {
          draft.chats.chats = draft.chats.chats.filter((chat) => chat.groupChat?.id !== groupChatId);

          if (draft.chats.selectedChatId === chatId) {
            draft.chats.selectedChatId = null;
          }
        } else {
          const chatIndex: number = getChatListChatIndex(chatId, draft.chats as IChatsState);

          draft.chats.chats[chatIndex].members.members = draft.chats.chats[chatIndex].members.members.filter(({ id }) => id !== userId);
        }

        return draft;
      });

      yield put(SetStore.action(nextState as RootState));
    };
  }
}
