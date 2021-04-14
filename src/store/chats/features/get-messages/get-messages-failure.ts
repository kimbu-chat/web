import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../chats-state';

export class GetMessagesFailure {
  static get action() {
    return createAction('GET_MESSAGES_FAILURE')<number>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GetMessagesFailure.action>) => {
        const chatId = payload;

        draft.messages[chatId].loading = false;
        return draft;
      },
    );
  }
}
