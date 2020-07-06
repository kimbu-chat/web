import { MessageList } from './interfaces';
import { MessagesActions } from './actions';
import _ from 'lodash';
import produce from 'immer';
import { MessagesActionTypes } from './types';

export interface MessagesState {
  loading: boolean;
  messages: MessageList[];
}

const initialState: MessagesState = {
  loading: false,
  messages: []
};

const checkIfDialogExists = (state: MessagesState, dialogId: number): boolean =>
  state.messages && state.messages.length > 0 && state?.messages?.findIndex((x) => x.dialogId === dialogId) > -1;
const getChatIndex = (state: MessagesState, dialogId: number): number =>
  state?.messages?.findIndex((x) => x.dialogId === dialogId);

const messages = produce(
  (draft: MessagesState = initialState, action: ReturnType<MessagesActions>): MessagesState => {
    switch (action.type) {
      case MessagesActionTypes.CREATE_MESSAGE_SUCCESS: {
        const { messageState, dialogId, oldMessageId, newMessageId } = action.payload;
        const chatIndex = getChatIndex(draft, dialogId);
        const messageIndex = draft.messages[chatIndex].messages.findIndex((x) => x.id == oldMessageId);
        (draft.messages[chatIndex].messages[messageIndex].id = newMessageId),
          (draft.messages[chatIndex].messages[messageIndex].state = messageState);
        return draft;
      }
      case MessagesActionTypes.GET_MESSAGES: {
        draft.loading = true;
        return draft;
      }
      case MessagesActionTypes.GET_MESSAGES_SUCCESS: {
        const { dialogId, hasMoreMessages, messages }: MessageList = action.payload;
        const isDialogExists = checkIfDialogExists(draft, dialogId);

        draft.loading = false;
        if (!isDialogExists) {
          draft.messages.push({
            dialogId: dialogId,
            hasMoreMessages: hasMoreMessages,
            messages: messages
          });
        } else {
          const chatIndex = getChatIndex(draft, dialogId);
          draft.messages[chatIndex].messages = _.unionBy(draft.messages[chatIndex].messages, messages, 'id');
          draft.messages[chatIndex].hasMoreMessages = hasMoreMessages;
        }

        return draft;
      }
      case MessagesActionTypes.GET_MESSAGES_FAILURE: {
        draft.loading = false;
        return draft;
      }
      case MessagesActionTypes.CREATE_MESSAGE: {
        const { dialog, message } = action.payload;
        const chatIndex = getChatIndex(draft, dialog.id);

        if (chatIndex === -1) {
          const messageList: MessageList = {
            dialogId: dialog.id,
            messages: [message],
            hasMoreMessages: false
          };
          draft.messages.unshift(messageList);
          console.log(draft);

          return draft;
        }

        draft.messages[chatIndex].messages.unshift(message);
        return draft;
      }
      default: {
        return draft;
      }
    }
  }
);

export default messages;
