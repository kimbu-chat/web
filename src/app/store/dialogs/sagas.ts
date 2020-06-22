import { call, put } from 'redux-saga/effects';
import { getDialogsAction, getDialogsSuccessAction, muteDialogAction, muteDialogSuccessAction } from './actions';
import { AxiosResponse } from 'axios';
import { Dialog, MuteDialogRequest, GetDialogsResponse } from './types';
import { getDialogsApi, muteDialogApi } from './api';
import { MessageState } from '../messages/types';
import { DialogRepository } from './dialog-service';

export function* getDialogsSaga(action: ReturnType<typeof getDialogsAction>): Iterator<any> {
  const dialogsRequestData = action.payload;
  // @ts-ignore
  const { data }: AxiosResponse<Array<Dialog>> = yield call(getDialogsApi, action.payload);
  data.forEach((dialog: Dialog) => {
    dialog.lastMessage.state =
      dialog.interlocutorLastReadMessageId && dialog.interlocutorLastReadMessageId >= Number(dialog?.lastMessage?.id)
        ? MessageState.READ
        : MessageState.SENT;
    dialog.interlocutorType = DialogRepository.getInterlocutorType(dialog);
    dialog.id = DialogRepository.getDialogIdentifier(dialog);
  });

  const dialogList: GetDialogsResponse = {
    dialogs: data,
    hasMore: data.length >= action.payload.page.limit,
    initializedBySearch: dialogsRequestData.initializedBySearch
  };

  yield put(getDialogsSuccessAction(dialogList));
}

export function* muteDialogSaga(action: ReturnType<typeof muteDialogAction>) {
  try {
    const dialog: Dialog = action.payload;

    const { interlocutor, conference, isMuted } = dialog;

    const request: MuteDialogRequest = {
      dialog: {
        conferenceId: interlocutor === null ? conference?.id : null,
        interlocutorId: conference === null ? interlocutor.id : null
      },
      isMuted: !isMuted
    };

    const response = yield call(muteDialogApi, request);

    if (response.status === 200) {
      yield put(muteDialogSuccessAction(dialog));
      const dialogCopy = { ...dialog };
      dialogCopy.isMuted = !isMuted;
      DialogRepository.addOrUpdateDialogs([dialog]);
    } else {
      alert('Error mute dialog');
    }
  } catch (e) {
    console.warn(e);
  }
}
