import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { IChatsState } from '../../models';
import { IEditGroupChatSuccessActionPayload } from '../delete-message/edit-group-chat-success-action-payload';

export class EditGroupChatSuccess {
  static get action() {
    return createAction('EDIT_GROUP_CHAT_SUCCESS')<IEditGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof EditGroupChatSuccess.action>) => {
      const { chatId, name, description, avatar } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.groupChat!.name = name;
        chat.groupChat!.description = description;
        chat.groupChat!.avatar = avatar;
      }
      return draft;
    });
  }
}
