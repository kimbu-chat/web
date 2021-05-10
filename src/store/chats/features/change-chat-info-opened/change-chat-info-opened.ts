import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';

export class ChangeChatInfoOpened {
  static get action() {
    return createAction('CHANGE_CHAT_INFO_OPENED')<number | undefined>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof ChangeChatInfoOpened.action>) => {
        if (payload) {
          draft.chatInfo.isInfoOpened = true;
        } else {
          draft.chatInfo.isInfoOpened = !draft.chatInfo.isInfoOpened;
        }
        draft.chatInfo.chatId = payload;

        return draft;
      },
    );
  }
}
