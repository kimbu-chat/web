import { createAction } from '@reduxjs/toolkit';
import { IAvatar } from 'kimbu-models';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';

export interface IEditGroupChatSuccessActionPayload {
  chatId: number;
  name: string;
  description?: string;
  avatar?: IAvatar;
}

export class EditGroupChatSuccess {
  static get action() {
    return createAction<IEditGroupChatSuccessActionPayload>('EDIT_GROUP_CHAT_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof EditGroupChatSuccess.action>) => {
      const { chatId, name, description, avatar } = payload;

      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat && chat.groupChat) {
        chat.groupChat.name = name;
        chat.groupChat.description = description;

        if (chat.groupChat.avatar?.id !== avatar?.id) {
          chat.groupChat.avatar = avatar;
        }
      }
      return draft;
    };
  }
}
