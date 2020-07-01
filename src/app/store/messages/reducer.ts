import { CreateMessageRequest, MessageList, CreateMessageResponse, GetMessagesResponse, Message } from './interfaces';
import {
  CREATE_MESSAGE,
  CREATE_MESSAGE_SUCCESS,
  GET_MESSAGES,
  GET_MESSAGES_FAILURE,
  GET_MESSAGES_SUCCESS
} from './types';
import _ from 'lodash';

export interface MessagesState {
  loading: boolean;
  messages: MessageList[];
}

const initialState: MessagesState = {
  loading: false,
  messages: []
};

export type TypedAction =
  | { type: typeof CREATE_MESSAGE; payload: CreateMessageRequest }
  | { type: typeof CREATE_MESSAGE_SUCCESS; payload: CreateMessageResponse }
  | { type: typeof GET_MESSAGES; payload: any }
  | {
      type: typeof GET_MESSAGES_SUCCESS;
      payload: GetMessagesResponse;
    }
  | { type: typeof GET_MESSAGES_FAILURE; payload: any };

const messages = (state: MessagesState = initialState, action: TypedAction): MessagesState => {
  switch (action.type) {
    case CREATE_MESSAGE_SUCCESS: {
      const { messageState, dialogId, oldMessageId, newMessageId } = action.payload;
      const newMessage: Message = {
        ...state.messages[dialogId].messages[oldMessageId],
        id: newMessageId,
        state: messageState
      };
      // delete old id and add new id into array

      return {
        ...state,
        messages: {
          ...state.messages,
          [dialogId]: {
            ...state.messages[dialogId],
            messages: [...state.messages[dialogId].messages, newMessage]
          }
        }
      };
    }
    case GET_MESSAGES: {
      return {
        ...state,
        loading: true
      };
    }
    case GET_MESSAGES_SUCCESS: {
      const { dialogId, isFromLocalDb, hasMoreMessages }: GetMessagesResponse = action.payload;
      const isDialogExists = state.messages.find((elem) => elem.dialogId === dialogId) ? true : false;

      // if server returned empty message list for interlocutor and there are
      // no messages in the store for interlocutor, create empty message list the in store
      if (!isDialogExists) {
        return {
          ...state,
          messages: {
            ...state.messages,
            [dialogId]: {
              ...state.messages[dialogId],
              hasMoreMessages: false,
              messages: []
            }
          }
        };
      } else {
        return {
          ...state,
          messages: {
            ...state.messages,
            [dialogId]: {
              ...state.messages[dialogId],
              hasMoreMessages: hasMoreMessages,
              dialogId: dialogId
            }
          },
          loading: isFromLocalDb
        };
      }
    }
    case GET_MESSAGES_FAILURE: {
      return {
        ...state,
        loading: false
      };
    }
    case CREATE_MESSAGE: {
      const { dialog, message } = action.payload;
      const isDialogExists = state.messages.find((elem) => elem.dialogId === dialog.id) ? true : false;

      if (!isDialogExists) {
        const messageList: MessageList = {
          dialogId: dialog.id,
          messages: [message],
          hasMoreMessages: false
        };

        return {
          ...state,
          messages: {
            ...state.messages,
            [dialog.id]: messageList
          }
        };
      }

      return {
        ...state,
        messages: {
          ...state.messages,
          [dialog.id]: {
            ...state.messages[dialog.id],
            messages: {
              ...state.messages[dialog.id].messages,
              [message.id]: message
            }
          }
        }
      };
    }
    default:
      return state;
  }
};

export default messages;
