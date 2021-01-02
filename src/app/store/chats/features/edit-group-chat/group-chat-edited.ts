import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../models';
import { IGroupChatEditedActionPayload } from './group-chat-edited-action-payload';

export class GroupChatEdited {
  static get action() {
    return createAction('GROUP_CHAT_EDITED')<IGroupChatEditedActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GroupChatEdited.action>) => {
      const { avatarId, avatarPreviewUrl, avatarUrl, description, name, id } = payload;

      const chatId: number = ChatId.from(undefined, id).id;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

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
