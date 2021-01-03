import { SetStore } from 'app/store/set-store';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { RootState } from 'store/root-reducer';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../models';
import { getChatListChatIndex } from '../../selectors';
import { IGroupChatEditedIntegrationEvent } from './group-chat-edited-integration-event';

export class GroupChatEditedEventHandler {
  static get action() {
    return createAction('GroupChatEdited')<IGroupChatEditedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof GroupChatEditedEventHandler.action>): SagaIterator {
      const { avatarId, avatarPreviewUrl, avatarUrl, description, name, id } = action.payload;

      const state: RootState = yield select();

      const nextState = produce(state, (draft) => {
        const chatId: number = ChatId.from(undefined, id).id;

        const chatIndex: number = getChatListChatIndex(chatId, draft.chats as IChatsState);

        if (chatIndex >= 0) {
          draft.chats.chats[chatIndex].groupChat!.name = name;
          draft.chats.chats[chatIndex].groupChat!.description = description;
          draft.chats.chats[chatIndex].groupChat!.avatar = {
            url: avatarUrl,
            previewUrl: avatarPreviewUrl,
            id: avatarId,
          };
        }

        return draft;
      });

      yield put(SetStore.action(nextState as RootState));
    };
  }
}
