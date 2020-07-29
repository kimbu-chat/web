import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { Dialog, MuteDialogRequest, GetDialogsResponse, HideDialogRequest, InterlocutorType } from './models';
import { MessageState, SystemMessageType, Message, CreateMessageRequest } from '../messages/models';
import { DialogService } from './dialog-service';
import { ChatActions } from './actions';
import { SagaIterator } from 'redux-saga';
import { FileUploadRequest, ErrorUploadResponse, uploadFileSaga } from 'app/utils/fileUploader/fileuploader';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { MessageHelpers } from 'app/common/helpers';
import { ConferenceCreatedIntegrationEvent } from '../middlewares/websockets/integration-events/conference-сreated-integration-event';
import { MessageActions } from '../messages/actions';
import { ChatHttpRequests } from './http-requests';
import { UpdateAvatarResponse } from '../common/models';
import { FriendActions } from '../friends/actions';
import { MyProfileService } from 'app/services/my-profile-service';
import { getType } from 'typesafe-actions';

export function* getDialogsSaga(action: ReturnType<typeof ChatActions.getChats>): SagaIterator {
  const dialogsRequestData = action.payload;
  const request = ChatHttpRequests.getChats;
  const { data }: AxiosResponse<Dialog[]> = request.call(yield call(() => request.generator(action.payload)));
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

  yield put(ChatActions.getChatsSuccess(dialogList));
}

export function* muteDialogSaga(action: ReturnType<typeof ChatActions.muteChat>) {
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

    const muteChatRequest = ChatHttpRequests.muteChat;
		const { status } = muteChatRequest.call(yield call(() => muteChatRequest.generator(request)));

    if (status === 200) {
      yield put(ChatActions.muteChatSuccess(dialog));
    } else {
      alert('Error mute dialog');
    }
  } catch (e) {
    console.warn(e);
  }
}

export function* removeDialogSaga(action: ReturnType<typeof ChatActions.removeChat>): SagaIterator {
  const dialog: Dialog = action.payload;
  let response: AxiosResponse;

  try {
    const request: HideDialogRequest = {
      dialog: {
        interlocutorId: dialog.interlocutor?.id
      },
      isHidden: true
    };

    const removeChatRequest = ChatHttpRequests.removeChat;
    response = removeChatRequest.call(yield call(() => removeChatRequest.generator(request)));

    if (response.status === 200) {
      yield put(ChatActions.removeChatSuccess(dialog));
    } else {
      alert('Error dialog deletion');
    }
  } catch (e) {
    console.warn(e);
  }
}

function* updloadConferenceAvatar(
  action: ReturnType<typeof ChatActions.changeConferenceAvatar> | ReturnType<typeof ChatActions.createConference>
): SagaIterator {
  const { avatarData, conferenceId } = action.payload;
  if (avatarData && conferenceId) {
    const { imagePath, offsetX, offsetY, width } = avatarData;
    if (!imagePath) {
      return;
    }

    const uploadRequest: FileUploadRequest<UpdateAvatarResponse> = {
      path: imagePath,
      url: 'http://files.ravudi.com/api/conference-avatars/',
      fileName: 'file',
      parameters: {
        'Square.Point.X': offsetX.toString(),
        'Square.Point.Y': offsetY.toString(),
        'Square.Size': width.toString(),
        ConferenceId: conferenceId.toString()
      },
      errorCallback(response: ErrorUploadResponse): void {
        alert('Error' + response.error);
      },
      *completedCallback(response) {
        yield put(ChatActions.changeConferenceAvatarSuccess({ conferenceId, ...response.data }));
        alert('Upload succes');

        if(action.type === getType(ChatActions.createConference)){
          action.meta.deferred?.resolve();
        }
      }
    };
    yield call(uploadFileSaga, uploadRequest);
  }
}

function* changeConferenceAvatarSaga(action: ReturnType<typeof ChatActions.changeConferenceAvatar>): SagaIterator {
  yield call(updloadConferenceAvatar, action);
}

function* addUsersToConferenceSaga(action: ReturnType<typeof ChatActions.addUsersToConference>): SagaIterator {
  try {
    const { dialog, userIds } = action.payload;
    const httpRequest = ChatHttpRequests.addMembersIntoConference;
		const { status } = httpRequest.call(
			yield call(() =>
				httpRequest.generator({
          conferenceId: dialog.conference?.id!,
          userIds: userIds
        }),
			),
		);

    if (status === HTTPStatusCode.OK) {
      yield put(FriendActions.unsetSelectedUserIdsForNewConference());
      yield put(ChatActions.addUsersToConferenceSuccess(dialog));

      action.meta.deferred?.resolve(action.payload.dialog);
    } else {
      console.warn('Failed to add users to conference');
    }
  } catch {
    alert('addUsersToConferenceSaga error');
  }
}

function* createConferenceSaga(action: ReturnType<typeof ChatActions.createConference>): SagaIterator {
  const { userIds, name, avatar } = action.payload;

  try {
    const httpRequest = ChatHttpRequests.createConference;
		const { data } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));

    const dialogId: number = DialogService.getDialogIdentifier(null, data);
    const dialog: Dialog = {
      interlocutorType: InterlocutorType.CONFERENCE,
      id: dialogId,
      conference: {
        id: data,
        membersCount: userIds.length + 1,
        name: name,
        avatarUrl: undefined
      },
      lastMessage: {
        creationDateTime: new Date(),
        id: new Date().getTime(),
        systemMessageType: SystemMessageType.ConferenceCreated,
        text: MessageHelpers.createSystemMessage({}),
        dialogId: dialogId,
        state: MessageState.LOCALMESSAGE,
        userCreator: action.payload.currentUser
      }
    };

    action.payload.conferenceId = data;
    action.payload.avatarData = avatar;

    yield put(FriendActions.unsetSelectedUserIdsForNewConference());
    yield put(ChatActions.createConferenceSuccess(dialog));
    yield put(ChatActions.changeSelectedChat(dialog.id));
    action.meta.deferred?.resolve(dialog);

    if (avatar) {
      yield call(updloadConferenceAvatar, action);
    }
  } catch (e) {
    console.warn(e);
    alert('createConferenceSaga error');
  }
}


function* createConferenceFromEventSaga(
  action: ReturnType<typeof ChatActions.createConferenceFromEvent>
): SagaIterator {
  const payload: ConferenceCreatedIntegrationEvent = action.payload;
  const dialogId: number = DialogService.getDialogIdentifier(null, payload.objectId);
  const currentUserId = new MyProfileService().myProfile.id;

  const message: Message = {
    systemMessageType: SystemMessageType.ConferenceCreated,
    text: MessageHelpers.createSystemMessage({}),
    creationDateTime: new Date(new Date().toUTCString()),
    userCreator: action.payload.userCreator,
    state: MessageState.READ,
    dialogId: dialogId,
    id: payload.systemMessageId
  };

  const dialog: Dialog = {
    interlocutorType: InterlocutorType.CONFERENCE,
    id: dialogId,
    conference: {
      id: payload.objectId,
      membersCount: payload.memberIds.length,
      name: action.payload.name
    },
    lastMessage: message
  };

  const createMessageRequest: CreateMessageRequest = {
    message: message,
    isFromEvent: true,
    dialog: dialog,
    currentUser: { id: currentUserId },
    selectedDialogId: dialog.id
  };

  yield put(MessageActions.createMessage(createMessageRequest));
}

function* getConferenceUsersSaga(action: ReturnType<typeof ChatActions.getConferenceUsers>): SagaIterator {
  const { initiatedByScrolling } = action.payload;
  const httpRequest = ChatHttpRequests.getConferenceMembers;
	const { data } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));
  yield put(ChatActions.getConferenceUsersSuccess({ users: data, initiatedByScrolling: initiatedByScrolling }));
}

function* leaveConferenceSaga(action: ReturnType<typeof ChatActions.leaveConference>): SagaIterator {
  try {
    const dialog: Dialog = action.payload;
    const httpRequest = ChatHttpRequests.leaveConferece;
		const { status } = httpRequest.call(yield call(() => httpRequest.generator(dialog?.conference?.id)));
    if (status === HTTPStatusCode.OK) {
      yield put(ChatActions.leaveConferenceSuccess(action.payload));
      // action.meta.deferred?.resolve();
    } else {
      alert('Error. http status is ' + status);
    }
  } catch {
    alert('leaveConferenceSaga error');
  }
}

function* renameConferenceSaga(action: ReturnType<typeof ChatActions.renameConference>): SagaIterator {
  const { dialog, newName } = action.payload;
  const httpRequest = ChatHttpRequests.renameConference;
	const { status } = httpRequest.call(
		yield call(() => httpRequest.generator({ id: dialog?.conference?.id!, name: newName })),
	);

  if (status === HTTPStatusCode.OK) {
    yield put(ChatActions.renameConferenceSuccess(action.payload));
    // action.meta.deferred?.resolve(dialog);
  } else {
    alert('renameConferenceSaga error');
  }
}

export const ChatSagas = [
  takeLatest(ChatActions.getChats, getDialogsSaga),
	takeLatest(ChatActions.renameConference, renameConferenceSaga),
  takeLatest(ChatActions.leaveConference, leaveConferenceSaga),
  takeLatest(ChatActions.getConferenceUsers, getConferenceUsersSaga),
  takeLatest(ChatActions.createConferenceFromEvent, createConferenceFromEventSaga),
  takeLatest(ChatActions.createConference, createConferenceSaga),
  takeLatest(ChatActions.changeConferenceAvatar, changeConferenceAvatarSaga),
  takeLatest(ChatActions.removeChat, removeDialogSaga),
  takeLatest(ChatActions.addUsersToConference, addUsersToConferenceSaga),
];