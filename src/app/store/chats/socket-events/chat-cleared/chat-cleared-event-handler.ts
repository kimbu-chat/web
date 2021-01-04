import { MyProfileService } from 'app/services/my-profile-service';
import produce from 'immer';
import { IChatsState } from 'store/chats/models';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IChatClearedIntegrationEvent } from './chat-cleared-integration-event';

export class ChatClearedEventHandler {
  static get action() {
    return createAction('ChatCleared')<IChatClearedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChatClearedEventHandler.action>) => {
      const { chatId, onlyForUserInitiator, userInitiatorId } = payload;

      const myId = new MyProfileService().myProfile.id;

      if (!onlyForUserInitiator || myId === userInitiatorId) {
        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.messages.messages = [];
          chat.messages.hasMore = false;
          chat.lastMessage = null;
        }
      }

      return draft;
    });
  }
}
