import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatExistsDraftSelector } from '../../selectors';
import { ICreateGroupChatSuccessActionPayload } from './action-payloads/create-group-chat-success-action-payload';
import { IChatsState } from '../../chats-state';

export class CreateGroupChatSuccess {
  static get action() {
    return createAction('CREATE_GROUP_CHAT_SUCCESS')<ICreateGroupChatSuccessActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof CreateGroupChatSuccess.action>) => {
        const newChat = payload;

        const isChatExists: boolean = getChatExistsDraftSelector(newChat.id, draft);

        if (!isChatExists) {
          draft.chats.chats.unshift(newChat);

          draft.messages[newChat.id] = {
            messages: [],
            messageIds: [],
            hasMore: true,
            loading: false,
          };

          return draft;
        }

        return draft;
      },
    );
  }
}
