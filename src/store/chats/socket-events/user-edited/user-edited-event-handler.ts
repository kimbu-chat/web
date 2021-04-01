import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { IUserEditedIntegrationEvent } from './action-payloads/user-edited-integration-event';
import { ChatId } from '../../chat-id';
import { getChatByIdDraftSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';

export class UserEditedEventHandler {
  static get action() {
    return createAction('UserEdited')<IUserEditedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof UserEditedEventHandler.action>) => {
        const {
          userId,
          firstName,
          lastName,
          nickname,
          avatarId,
          avatarUrl,
          avatarPreviewUrl,
        } = payload;
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
      },
    );
  }
}
