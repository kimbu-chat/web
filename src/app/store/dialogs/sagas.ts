import { call, put } from 'redux-saga/effects';
import {
  getDialogsAction,
  getDialogsSuccessAction,
  muteDialogAction,
  muteDialogSuccessAction,
  removeDialogAction,
  removeDialogSuccessAction
} from './actions';
import { markMessagesAsReadAction } from '../messages/actions';
import { AxiosResponse } from 'axios';
import { Dialog, MuteDialogRequest, GetDialogsResponse, HideDialogRequest } from './types';
import { getDialogsApi, muteDialogApi, removeDialogApi } from './api';
import { leaveConfereceApi } from '../conferences/api';
import { MarkMessagesAsReadRequest, MessageState } from '../messages/interfaces';
import { markMessagesAsReadApi } from '../messages/api';
import { DialogService } from './dialog-service';

export function* getDialogsSaga(action: ReturnType<typeof getDialogsAction>): Iterator<any> {
  const dialogsRequestData = action.payload;
  // @ts-ignore
  const { data }: AxiosResponse<Array<Dialog>> = yield call(getDialogsApi, action.payload);
  data.forEach((dialog: Dialog) => {
    dialog.lastMessage.state =
      dialog.interlocutorLastReadMessageId && dialog.interlocutorLastReadMessageId >= Number(dialog?.lastMessage?.id)
        ? (MessageState.READ as MessageState)
        : (MessageState.SENT as MessageState);
    dialog.interlocutorType = DialogService.getInterlocutorType(dialog);
    dialog.id = DialogService.getDialogIdentifier(dialog.interlocutor?.id, dialog.conference?.id);
  });

  const dialogList: GetDialogsResponse = {
    dialogs: data,
    hasMore: data.length >= action.payload.page.limit,
    initializedBySearch: dialogsRequestData.initializedBySearch
  };

  yield put(getDialogsSuccessAction(dialogList));
}

export function* muteDialogSaga(action: ReturnType<typeof muteDialogAction>) {
  console.log(789456);
  try {
    const dialog: Dialog = action.payload;

    const { interlocutor, conference, isMuted } = dialog;

    const request: MuteDialogRequest = {
      dialog: {
        conferenceId: interlocutor === null ? conference?.id : null,
        interlocutorId: conference === null ? interlocutor?.id : null
      },
      isMuted: !isMuted
    };

    const response = yield call(muteDialogApi, request);

    if (response.status === 200) {
      yield put(muteDialogSuccessAction(dialog));
    } else {
      alert('Error mute dialog');
    }
  } catch (e) {
    console.warn(e);
  }
}

export function* resetUnreadMessagesCountSaga(action: ReturnType<typeof markMessagesAsReadAction>): Iterator<any> {
  {
    const request: MarkMessagesAsReadRequest = {
      dialog: {
        conferenceId: action.payload.interlocutor === null ? action.payload.conference?.id : undefined,
        interlocutorId: action.payload.conference === null ? action.payload.interlocutor?.id : undefined
      }
    };

    yield call(markMessagesAsReadApi, request);
  }
}

export function* removeDialogSaga(action: ReturnType<typeof removeDialogAction>) {
  const dialog: Dialog = action.payload;
  let response: AxiosResponse;

  try {
    if (dialog.interlocutor) {
      const request: HideDialogRequest = {
        dialog: {
          interlocutorId: dialog.interlocutor.id
        },
        isHidden: true
      };

      response = yield call(removeDialogApi, request);
    } else {
      response = yield call(leaveConfereceApi, dialog.conference?.id || -1);
    }

    if (response.status === 200) {
      yield put(removeDialogSuccessAction(dialog));
    } else {
      alert('Error dialog deletion');
    }
  } catch (e) {
    console.warn(e);
  }
}
