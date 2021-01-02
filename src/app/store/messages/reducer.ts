import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { MESSAGES_LIMIT } from 'utils/pagination-limits';
import { IMessagesState } from './models';
import { ChatActions } from '../chats/actions';
import { GetMessages } from './features/get-messages/get-messages';
import { CreateMessageSuccess } from './features/create-message/create-message-success';
import { CreateMessage } from './features/create-message/create-message';
import { DeleteMessageSuccess } from './features/delete-message/delete-message-success';
import { GetMessagesFailure } from './features/get-messages/get-messages-failure';
import { GetMessagesSuccess } from './features/get-messages/get-messages-success';
import { ReplyToMessage } from './features/reply-to-message/reply-to-message';
import { ResetSelectedMessages } from './features/select-message/reset-selected-messages';
import { SelectMessage } from './features/select-message/select-message';
import { EditMessage } from './features/edit-message/edit-message';
import { ResetEditMessage } from './features/edit-message/reset-edit-message';
import { ResetReplyToMessage } from './features/reply-to-message/reset-reply-to-message';
import { SubmitEditMessage } from './features/edit-message/submit-edit-message';
import { SubmitEditMessageSuccess } from './features/edit-message/sumbit-edit-message-success';
import { getMessagesChatIndex } from './selectors';
import { MessagesDeletedFromEvent } from './features/delete-message/messages-deleted-from-event';
import { ClearChatHistorySuccess } from './features/clear-history/clear-chat-history-success';

const initialState: IMessagesState = {
  loading: false,
  messages: [],
  selectedMessageIds: [],
};

const messages = createReducer<IMessagesState>(initialState)
  .handleAction(CreateMessageSuccess.action, CreateMessageSuccess.reducer)
  .handleAction(GetMessages.action, GetMessages.reducer)
  .handleAction(GetMessagesSuccess.action, GetMessagesSuccess.reducer)
  .handleAction(GetMessagesFailure.action, GetMessagesFailure.reducer)
  .handleAction(CreateMessage.action, CreateMessage.reducer)
  .handleAction(DeleteMessageSuccess.action, DeleteMessageSuccess.reducer)
  .handleAction(SelectMessage.action, SelectMessage.reducer)
  .handleAction(ResetSelectedMessages.action, ResetSelectedMessages.reducer)
  .handleAction(ReplyToMessage.action, ReplyToMessage.reducer)
  .handleAction(EditMessage.action, EditMessage.reducer)
  .handleAction(SubmitEditMessage.action, SubmitEditMessage.reducer)
  .handleAction(SubmitEditMessageSuccess.action, SubmitEditMessageSuccess.reducer)
  .handleAction(ResetReplyToMessage.action, ResetReplyToMessage.reducer)
  .handleAction(ResetEditMessage.action, ResetEditMessage.reducer)
  .handleAction(MessagesDeletedFromEvent.action, MessagesDeletedFromEvent.reducer)
  .handleAction(ClearChatHistorySuccess.action, ClearChatHistorySuccess.reducer)
  .handleAction(
    ChatActions.changeSelectedChat,
    produce((draft: IMessagesState, { payload }: ReturnType<typeof ChatActions.changeSelectedChat>) => {
      const { oldChatId } = payload;

      if (oldChatId) {
        const chatIndex = getMessagesChatIndex(draft, oldChatId);

        if (draft.messages[chatIndex] && draft.messages[chatIndex].messages.length > MESSAGES_LIMIT) {
          draft.messages[chatIndex].messages = draft.messages[chatIndex].messages.slice(0, 30);
        }

        if (draft.messages[chatIndex]) {
          draft.messages[chatIndex].messages.map((message) => {
            message.isSelected = false;
            return message;
          });
        }
      }

      draft.selectedMessageIds = [];

      draft.messageToReply = undefined;
      draft.messageToEdit = undefined;

      return draft;
    }),
  );

export default messages;
