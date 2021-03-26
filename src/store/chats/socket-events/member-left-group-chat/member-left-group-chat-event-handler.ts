import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MyProfileService } from '../../../../services/my-profile-service';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';
import { IMemberLeftGroupChatIntegrationEvent } from './member-left-group-chat-integration-event';

export class MemberLeftGroupChatEventHandler {
  static get action() {
    return createAction('MemberLeftGroupChat')<IMemberLeftGroupChatIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MemberLeftGroupChatEventHandler.action>) => {
      const { groupChatId, userId } = payload;
      const chatId = ChatId.from(undefined, groupChatId).id;

      const myId = new MyProfileService().myProfile.id;

      const isCurrentUserEventCreator = myId === userId;

      if (isCurrentUserEventCreator) {
        draft.chats = draft.chats.filter((chat) => chat.groupChat?.id !== groupChatId);

        if (draft.selectedChatId === chatId) {
          draft.selectedChatId = null;
        }
      } else {
        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.members.members = chat.members.members.filter(({ id }) => id !== userId);
        }
      }

      return draft;
    });
  }
}