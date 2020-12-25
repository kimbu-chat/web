import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { ChatId } from '../../chat-id';
import { ChatsState } from '../../models';
import { GroupChatEditedActionPayload } from './group-chat-edited-action-payload';

export class GroupChatEdited {
  static get action() {
    return createAction('GROUP_CHAT_EDITED')<GroupChatEditedActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GroupChatEdited.action>) => {
      const { avatarId, avatarPreviewUrl, avatarUrl, description, name, id } = payload;

      const chatId: number = ChatId.from(undefined, id).id;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].groupChat!.name = name;
        draft.chats[chatIndex].groupChat!.description = description;
        draft.chats[chatIndex].groupChat!.avatar = {
          url: avatarUrl,
          previewUrl: avatarPreviewUrl,
          id: avatarId,
        };
      }
      return draft;
    });
  }
}
