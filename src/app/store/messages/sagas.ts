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
  SystemMessageType,
  MessagesReqData,
  MessageList
} from './interfaces';

import { InterlocutorType } from '../dialogs/types';
import { DialogService } from '../dialogs/dialog-service';

export function* messages(action: ReturnType<typeof getMessagesAction>): Iterator<any> {
  const { page, dialog } = action.payload;
  const isConference: boolean = Boolean(dialog.conference);

    const request: MessagesReqData = {
      page: page,
      dialog: {
        id: isConference ? dialog.conference?.id : dialog.interlocutor?.id,
        type: isConference ? 'Conference' : 'User'
      }
    };

    //@ts-ignore
    const { data }: AxiosResponse<Array<Message>> = yield call(getMessagesApi, request);

    data.forEach((message) => {
      message.state =
        dialog.interlocutorLastReadMessageId && dialog.interlocutorLastReadMessageId >= message.id
          ? MessageState.READ
          : MessageState.SENT;
    });
    let messageList: MessageList = {
      dialogId: dialog.id,
      messages: data,
      hasMoreMessages: data.length >= page.limit
    };

    yield put(getMessagesSuccessAction(messageList));
}

export function* createMessage(action: ReturnType<typeof createMessageAction>): Iterator<any> {
  let { message, dialog, isFromEvent } = {...action.payload};
  dialog.lastMessage = message;
  const {interlocutorId, interlocutorType} = DialogService.parseDialogId(dialog.id);
  console.log('create')
  if (isFromEvent) {
    yield call(notifyInterlocutorThatMessageWasRead, action.payload);
  } else {
    try {
        const messageCreationReq: MessageCreationReqData = {
          text: message.text,
          conferenceId: interlocutorType === InterlocutorType.CONFERENCE ? interlocutorId: null,
          userInterlocutorId: interlocutorType === InterlocutorType.USER ? interlocutorId: null
        };

        //@ts-ignore
        const { data } = yield call(createMessageApi, messageCreationReq);

        yield put(
          createMessageSuccessAction({
            dialogId: message.dialogId || 0,
            oldMessageId: message.id,
            newMessageId: data,
            messageState: MessageState.SENT
          })
        );
    } catch {
      alert("error message create")
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
    //@ts-ignore
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
