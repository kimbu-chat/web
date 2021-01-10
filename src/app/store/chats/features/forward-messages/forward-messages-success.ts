import { IMessage } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { IChatsState, MessageState, SystemMessageType } from '../../models';
import { IForwardMessagesSuccessActionPayload } from './action-payloads/forward-messages-success-action-payload';

export class ForwardMessagesSuccess {
  static get action() {
    return createAction('FORWARD_MESSAGES_SUCCESS')<IForwardMessagesSuccessActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ForwardMessagesSuccess.action>) => {
      const { messagesToForward, chatIdsToForward, forwardedChatId, creationDateTime, userCreator } = payload;

      const forwardedChat = getChatByIdDraftSelector(forwardedChatId, draft);

      messagesToForward.forEach(({ messageId, serverMessageId }) => {
        const message = forwardedChat?.messages.messages.find(({ id }) => id === messageId);

        const buildedMessage: IMessage = {
          id: serverMessageId,
          linkedMessageType: 'Forward',
          linkedMessage: message,
          text: '',
          systemMessageType: SystemMessageType.None,
          state: MessageState.SENT,
          chatId: forwardedChatId,
          isEdited: false,
          creationDateTime,
          userCreator,
        };

        chatIdsToForward.forEach((chatToReplyId) => {
          const chatToReply = getChatByIdDraftSelector(chatToReplyId, draft);

          if (chatToReply) {
            chatToReply.messages.messages.unshift(buildedMessage);

            chatToReply.lastMessage = buildedMessage;
          }
        });
      });
    });
  }
}
