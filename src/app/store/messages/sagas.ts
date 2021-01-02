import { takeLatest, takeEvery } from 'redux-saga/effects';
import { CopyMessages } from './features/copy-messages/copy-messages';
import { CreateMessage } from './features/create-message/create-message';
import { DeleteMessage } from './features/delete-message/delete-message';
import { GetMessages } from './features/get-messages/get-messages';
import { MessageTyping } from './features/message-typing/message-typing';
import { SubmitEditMessage } from './features/edit-message/submit-edit-message';
import { DeleteMessageSuccess } from './features/delete-message/delete-message-success';
import { MessagesDeletedFromEvent } from './features/delete-message/messages-deleted-from-event';
import { ClearChatHistory } from './features/clear-history/clear-chat-history';
import { MessageCreatedEventHandler } from './socket-events/message-created/message-created-event-handler';
import { MessageReadEventHandler } from './socket-events/message-read/message-read-event-handler';
import { MessageEditedEventHandler } from './socket-events/message-edited/message-edited-event-handler';

export const MessageSagas = [
  takeLatest(MessageTyping.action, MessageTyping.saga),
  takeLatest(GetMessages.action, GetMessages.saga),
  takeLatest(DeleteMessageSuccess.action, DeleteMessageSuccess.saga),
  takeLatest(MessagesDeletedFromEvent.action, MessagesDeletedFromEvent.saga),
  takeLatest(ClearChatHistory.action, ClearChatHistory.saga),
  takeEvery(CreateMessage.action, CreateMessage.saga),
  takeEvery(CopyMessages.action, CopyMessages.saga),
  takeEvery(SubmitEditMessage.action, SubmitEditMessage.saga),
  takeEvery(DeleteMessage.action, DeleteMessage.saga),

  // socket-events
  takeEvery(MessageCreatedEventHandler.action, MessageCreatedEventHandler.saga),
  takeEvery(MessageReadEventHandler.action, MessageReadEventHandler.saga),
  takeEvery(MessageEditedEventHandler.action, MessageEditedEventHandler.saga),
];
