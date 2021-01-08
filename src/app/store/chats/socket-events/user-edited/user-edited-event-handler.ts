import { getChatByIdDraftSelector } from 'store/chats/selectors';
import { ChatId } from 'store/chats/chat-id';
import { IUserEditedIntegrationEvent } from 'app/store/chats/socket-events/user-edited/action-payloads/user-edited-integration-event';
import produce from 'immer';
import { IChatsState } from 'store/chats/models';
import { createAction } from 'typesafe-actions';

export class UserEditedEventHandler {
  static get action() {
    return createAction('UserEdited')<IUserEditedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UserEditedEventHandler.action>) => {
      const { userId, firstName, lastName, nickname, avatarId, avatarUrl, avatarPreviewUrl } = payload;
      const chatId = ChatId.from(userId).id;

      const user = getChatByIdDraftSelector(chatId, draft)?.interlocutor;

      if (!user) {
        return draft;
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.nickname = nickname;

      user.avatar = {
        id: avatarId,
        url: avatarUrl,
        previewUrl: avatarPreviewUrl,
      };

      return draft;
    });
  }
}
