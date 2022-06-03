import { createAction } from '@reduxjs/toolkit';

import { INormalizedChat } from '@store/chats/models';

import { IChatsState } from '../../chats-state';
import { getChatExistsDraftSelector } from '../../selectors';

export type ICreateGroupChatSuccessActionPayload = INormalizedChat;

export class CreateGroupChatSuccess {
  static get action() {
    return createAction<ICreateGroupChatSuccessActionPayload>('CREATE_GROUP_CHAT_SUCCESS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof CreateGroupChatSuccess.action>) => {
        const newChat = payload;

        const isChatExists: boolean = getChatExistsDraftSelector(newChat.id, draft);

        if (!isChatExists) {
          draft.chats[newChat.id] = newChat;

          draft.chatList.chatIds.unshift(newChat.id);

          return draft;
        }

        return draft;
      };
  }
}
