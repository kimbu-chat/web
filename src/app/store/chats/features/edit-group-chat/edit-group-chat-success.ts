import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState } from '../../models';
import { EditGroupChatSuccessActionPayload } from './edit-group-chat-success-action-payload';

export class EditGroupChatSuccess {
  static get action() {
    return createAction('EDIT_GROUP_CHAT_SUCCESS')<EditGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof EditGroupChatSuccess.action>) => {
      const { id, name, description, avatar } = payload;

      const chatId: number = new ChatId().From(undefined, id).entireId;

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
