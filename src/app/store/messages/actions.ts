import { CopyMessages } from './features/copy-messages/copy-messages';
import { CreateMessage } from './features/create-message/create-message';
import { CreateMessageSuccess } from './features/create-message/create-message-success';
import { DeleteMessage } from './features/delete-message/delete-message';
import { DeleteMessageSuccess } from './features/delete-message/delete-message-success';
import { EditMessage } from './features/edit-message/edit-message';
import { GetMessages } from './features/get-messages/get-messages';
import { GetMessagesFailure } from './features/get-messages/get-messages-failure';
import { GetMessagesSuccess } from './features/get-messages/get-messages-success';
import { MessageEdited } from './features/message-edited/message-edited';
import { MessageTyping } from './features/message-typing/message-typing';
import { ReplyToMessage } from './features/reply-to-message/reply-to-message';
import { ResetEditMessage } from './features/edit-message/reset-edit-message';
import { ResetReplyToMessage } from './features/reply-to-message/reset-reply-to-message';
import { SelectMessage } from './features/select-message/select-message';
import { SubmitEditMessage } from './features/edit-message/submit-edit-message';
import { SubmitEditMessageSuccess } from './features/edit-message/sumbit-edit-message-success';
import { ResetSelectedMessages } from './features/select-message/reset-selected-messages';
import { MessagesDeletedFromEvent } from './features/delete-message/messages-deleted-from-event';
import { ClearChatHistory } from './features/clear-history/clear-chat-history';
import { ClearChatHistorySuccess } from './features/clear-history/clear-chat-history-success';
import { MessageCreatedEventHandler } from './socket-events/message-created/message-created-event-handler';

export namespace MessageActions {
  export const getMessages = GetMessages.action;
  export const getMessagesSuccess = GetMessagesSuccess.action;
  export const getMessagesFailure = GetMessagesFailure.action;
  export const createMessage = CreateMessage.action;
  export const createMessageSuccess = CreateMessageSuccess.action;
  export const messageTyping = MessageTyping.action;
  export const deleteMessage = DeleteMessage.action;
  export const deleteMessageSuccess = DeleteMessageSuccess.action;
  export const selectMessage = SelectMessage.action;
  export const resetSelectedMessages = ResetSelectedMessages.action;
  export const copyMessages = CopyMessages.action;
  export const replyToMessage = ReplyToMessage.action;
  export const resetReplyToMessage = ResetReplyToMessage.action;
  export const editMessage = EditMessage.action;
  export const submitEditMessage = SubmitEditMessage.action;
  export const submitEditMessageSuccess = SubmitEditMessageSuccess.action;
  export const messageEdited = MessageEdited.action;
  export const resetEditMessage = ResetEditMessage.action;
  export const messagesDeletedFromEvent = MessagesDeletedFromEvent.action;
  export const clearChatHistory = ClearChatHistory.action;
  export const clearChatHistorySuccess = ClearChatHistorySuccess.action;

  // socket-events
  export const messageCreatedEventHandler = MessageCreatedEventHandler.action;
}
