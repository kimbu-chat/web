import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { MyProfileService } from '../../../../services/my-profile-service';
import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector } from '../../selectors';
import { IChatClearedIntegrationEvent } from './chat-cleared-integration-event';

export class ChatClearedEventHandler {
  static get action() {
    return createAction('ChatCleared')<IChatClearedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof ChatClearedEventHandler.action>) => {
        const { chatId, onlyForUserInitiator, userInitiatorId } = payload;

        const myId = new MyProfileService().myProfile.id;

        if (!onlyForUserInitiator || myId === userInitiatorId) {
          const chat = getChatByIdDraftSelector(chatId, draft);

          const chatMessages = draft.messages[chatId];

          if (chatMessages && chatMessages.messageIds.length !== 0) {
            chatMessages.messages = [];
            chatMessages.hasMore = false;

            if (chat) {
              chat.lastMessage = null;
            }
          }
        }

        return draft;
      },
    );
  }
}
