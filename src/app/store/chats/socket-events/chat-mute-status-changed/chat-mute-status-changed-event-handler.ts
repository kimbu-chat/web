import { RootState } from 'app/store/root-reducer';
import { SetStore } from 'app/store/set-store';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IChatMutedStatusChangedIntegrationEvent } from './chat-mute-status-changed-integration-event';

export class ChatMutedStatusChangedEventHandler {
  static get action() {
    return createAction('ChatsMuteStatusChanged')<IChatMutedStatusChangedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof ChatMutedStatusChangedEventHandler.action>): SagaIterator {
      const state: RootState = yield select();
      const { chatIds, isMuted } = action.payload;

      const nextState = produce(state, (draft) => {
        draft.chats.chats.map((chat) => {
          if (chatIds.includes(chat.id)) {
            chat.isMuted = !isMuted;
          }

          return chat;
        });

        return draft;
      });

      yield put(SetStore.action(nextState as RootState));
    };
  }
}
