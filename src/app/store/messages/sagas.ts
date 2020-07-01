import { AxiosResponse } from 'axios';
import { call, put } from 'redux-saga/effects';

import {
  createMessageAction,
  createMessageSuccessAction,
  getMessagesAction,
  getMessagesSuccessAction,
  messageTypingAction
} from './actions';

import { createMessageApi, markMessagesAsReadApi, messageTypingApi, getMessagesApi } from './api';
import {
  CreateMessageRequest,
  Message,
  MessageCreationReqData,
  MessageState,
  GetMessagesResponse,
  SystemMessageType,
  MessagesReqData
} from './interfaces';

import { InterlocutorType } from '../dialogs/types';

export function* messages(action: ReturnType<typeof getMessagesAction>): Iterator<any> {
  const { page, dialog } = action.payload;
  const isConference: boolean = Boolean(dialog.conference);

  let messageList: GetMessagesResponse = {
    dialogId: dialog.id,
    messages: [],
    hasMoreMessages: messages.length >= page.limit,
    isFromLocalDb: true
  };
  yield put(getMessagesSuccessAction(messageList));

  {
    const request: MessagesReqData = {
      page: page,
      dialog: {
        id: isConference ? dialog.conference?.id : dialog.interlocutor?.id,
        type: isConference ? 'Conference' : 'User'
      }
    };

    const { data }: AxiosResponse<Array<Message>> = yield call(getMessagesApi, request);

    data.forEach((message) => {
      message.state =
        dialog.interlocutorLastReadMessageId && dialog.interlocutorLastReadMessageId >= message.id
          ? MessageState.READ
          : MessageState.SENT;
    });

    let messageList: GetMessagesResponse = {
      dialogId: dialog.id,
      messages: data,
      hasMoreMessages: data.length >= page.limit,
      isFromLocalDb: false
    };

    yield put(getMessagesSuccessAction(messageList));
  }
}

function* sendMessageToServer(message: Message): Iterator<any> {
  const { interlocutorId, interlocutorType } = DialogRepository.parseDialogId(message.dialogId);
  const messageCreationReq: MessageCreationReqData = {
    text: message.text,
    conferenceId: interlocutorType === InterlocutorType.CONFERENCE ? interlocutorId : null,
    userInterlocutorId: interlocutorType === InterlocutorType.USER ? interlocutorId : null
  };
  const { data }: AxiosResponse<number> = yield call(createMessageApi, messageCreationReq);
  return data;
}

export function* createMessage(action: ReturnType<typeof createMessageAction>): Iterator<any> {
  const { message, dialog, isFromEvent } = action.payload;
  const isInternetAvailable: boolean = yield call(checkInternetConnection);
  dialog.lastMessage = message;
  if (isFromEvent) {
    yield call(notifyInterlocutorThatMessageWasRead, action.payload);
    MessageRepository.addOrUpdateMessages([message], dialog.id);
    DialogRepository.updateDialogLastMessage(message, dialog);
  } else {
    try {
      if (isInternetAvailable) {
        const messageId: number = yield call(sendMessageToServer, message);
        yield put(
          createMessageSuccessAction({
            dialogId: message.dialogId,
            oldMessageId: message.id,
            newMessageId: messageId,
            messageState: MessageState.SENT
          })
        );
        message.id = messageId;
        message.state = MessageState.SENT;
      }
    } catch {
      yield put(
        createMessageSuccessAction({
          dialogId: message.dialogId,
          oldMessageId: message.id,
          newMessageId: message.id,
          messageState: MessageState.ERROR
        })
      );
      message.state = MessageState.ERROR;
      MessageRepository.addOrUpdateMessages([message], dialog.id);
      DialogRepository.updateDialogLastMessage(message, dialog);
    }
  }
}

export function* messageTyping(action: ReturnType<typeof messageTypingAction>): Iterator<any> {
  yield call(messageTypingApi, action.payload);
}

export function* notifyInterlocutorThatMessageWasRead(createMessageRequest: CreateMessageRequest): Iterator<any> {
  const { dialog, currentUser, selectedDialogId, message } = createMessageRequest;

  if (
    !selectedDialogId ||
    !Boolean(message.userCreator) ||
    currentUser.id === message.userCreator?.id ||
    message.systemMessageType !== SystemMessageType.None
  ) {
    return;
  }
  const isDestinationTypeUser: boolean = dialog.interlocutorType === InterlocutorType.USER;

  const isDialogCurrentInterlocutor: boolean = dialog.id == selectedDialogId;
  if (isDialogCurrentInterlocutor) {
    yield call(markMessagesAsReadApi, {
      dialog: {
        conferenceId: isDestinationTypeUser ? null : dialog.conference?.id,
        interlocutorId: isDestinationTypeUser ? message.userCreator?.id : null
      }
    });
  } else {
    console.warn('notifyInterlocutorThatMessageWasRead Error');
  }
}
