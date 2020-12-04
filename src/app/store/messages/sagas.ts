import { takeLatest, takeEvery } from 'redux-saga/effects';
import { CopyMessages } from './features/copy-messages';
import { CreateMessage } from './features/create-message';
import { DeleteMessage } from './features/delete-message';
import { GetMessages } from './features/get-messages';
import { MessageTyping } from './features/message-typing';
import { SubmitEditMessage } from './features/submit-edit-message';

export const MessageSagas = [
  takeLatest(MessageTyping.action, MessageTyping.saga),
  takeLatest(GetMessages.action, GetMessages.saga),
  takeEvery(CreateMessage.action, CreateMessage.saga),
  takeEvery(CopyMessages.action, CopyMessages.saga),
  takeEvery(SubmitEditMessage.action, SubmitEditMessage.saga),
  takeEvery(DeleteMessage.action, DeleteMessage.saga),
];
