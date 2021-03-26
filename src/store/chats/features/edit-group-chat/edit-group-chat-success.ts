import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IEditGroupChatSuccessActionPayload } from './action-payloads/edit-group-chat-success-action-payload';
import { IChatsState } from '../../chats-state';

export class EditGroupChatSuccess {
  static get action() {
    return createAction('EDIT_GROUP_CHAT_SUCCESS')<IEditGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof EditGroupChatSuccess.action>) => {
      const { chatId, name, description, avatar } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat && chat.groupChat) {
        chat.groupChat.name = name;
        chat.groupChat.description = description;
        chat.groupChat.avatar = avatar;
      }
      return draft;
    });
  }
}