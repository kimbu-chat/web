import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { IChatsState } from '../../chats-state';

export class ChangeChatInfoOpened {
  static get action() {
    return createEmptyAction('CHANGE_CHAT_INFO_OPENED');
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.isInfoOpened = !draft.isInfoOpened;

      return draft;
    });
  }
}
