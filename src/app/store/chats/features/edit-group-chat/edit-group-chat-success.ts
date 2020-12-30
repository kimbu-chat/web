import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../models';
import { IEditGroupChatSuccessActionPayload } from './edit-group-chat-success-action-payload';

export class EditGroupChatSuccess {
  static get action() {
    return createAction('EDIT_GROUP_CHAT_SUCCESS')<IEditGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof EditGroupChatSuccess.action>) => {
      const { id, name, description, avatar } = payload;

      const chatId: number = ChatId.from(undefined, id).id;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].groupChat!.name = name;
        draft.chats[chatIndex].groupChat!.description = description;
        draft.chats[chatIndex].groupChat!.avatar = avatar;
      }
      return draft;
    });
  }
}
