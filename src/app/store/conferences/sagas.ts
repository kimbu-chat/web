import { call, put } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { Helpers } from 'app/common/helpers';
import { CreateMessageRequest, Message, MessageState, SystemMessageType } from '../messages/interfaces';
import {
  createConferenceAction,
  createConferenceFromEventAction,
  getConferenceUsersAction,
  getConferenceUsersSuccessAction,
  leaveConferenceAction,
  addUsersToConferenceAction,
  renameConferenceAction,
  renameConferenceSuccessAction,
  leaveConferenceSuccessAction,
  addUsersToConferenceSuccessAction,
  //	changeConferenceAvatarAction,
  createConferenceSuccessAction
} from './actions';
import {
  createConfereceApi,
  getConferenceUsersApi,
  leaveConfereceApi,
  addUsersToConferenceApi,
  renameConferenceApi
} from './api';
import { UserPreview } from '../contacts/types';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { createMessageAction } from '../messages/actions';
import { DialogService } from '../dialogs/dialog-service';
import { AuthService } from 'app/services/auth-service';
import { ConferenceCreatedIntegrationEvent } from '../middlewares/websockets/integration-events/conference-сreated-integration-event';
import { changeSelectedDialogAction } from '../dialogs/actions';
import { unsetSelectedUserIdsForNewConferenceAction } from '../friends/actions';
import { Dialog, InterlocutorType } from '../dialogs/types';
import { UpdateAvatarResponse } from '../user/interfaces';
import { SagaIterator } from 'redux-saga';
import { FileUploadRequest, ErrorUploadResponse, uploadFileSaga } from 'app/utils/fileUploader/fileuploader';
import { changeConferenceAvatarSuccessAction, changeConferenceAvatarAction } from './actions';

function* updloadConferenceAvatar(action: ReturnType<typeof changeConferenceAvatarAction>): SagaIterator {
  const { avatarData, conferenceId } = action.payload;
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
      yield put(changeConferenceAvatarSuccessAction({ conferenceId, ...response.data }));
      action.deferred?.resolve();
    }
  };
  yield call(uploadFileSaga, uploadRequest);
}

export function* changeConferenceAvatarSaga(action: ReturnType<typeof changeConferenceAvatarAction>): SagaIterator {
  yield call(updloadConferenceAvatar, action);
}

export function* addUsersToConferenceSaga(action: ReturnType<typeof addUsersToConferenceAction>): Iterator<any> {
  try {
    const { dialog, userIds } = action.payload;
    // @ts-ignore
    const { status }: AxiosResponse<number> = yield call(addUsersToConferenceApi, {
      conferenceId: dialog.conference?.id,
      userIds: userIds
    });
    if (status === HTTPStatusCode.OK) {
      yield put(unsetSelectedUserIdsForNewConferenceAction());
      yield put(addUsersToConferenceSuccessAction(dialog));

      action.deferred?.resolve(action.payload.dialog);
    } else {
      console.warn('Failed to add users to conference');
    }
  } catch {
    alert('addUsersToConferenceSaga error');
  }
}

export function* createConferenceSaga(action: ReturnType<typeof createConferenceAction>): Iterator<any> {
  const { userIds, name } = action.payload;

  try {
    // @ts-ignore
    const { data }: AxiosResponse<number> = yield call(createConfereceApi, action.payload);
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
        text: Helpers.createSystemMessage({}),
        dialogId: dialogId,
        state: MessageState.LOCALMESSAGE,
        userCreator: action.payload.currentUser
      }
    };

    // if (avatar) {
    //   yield call(updloadConferenceAvatar, avatar, dialog.conference.id);
    // }

    yield put(unsetSelectedUserIdsForNewConferenceAction());
    yield put(createConferenceSuccessAction(dialog));
    yield put(changeSelectedDialogAction(dialog.id));
    action.deferred?.resolve(dialog);
  } catch (e) {
    console.warn(e);
    alert('createConferenceSaga error');
  }
}

export function* createConferenceFromEventSaga(
  action: ReturnType<typeof createConferenceFromEventAction>
): Iterator<any> {
  const payload: ConferenceCreatedIntegrationEvent = action.payload;
  const dialogId: number = DialogService.getDialogIdentifier(null, payload.objectId);
  const currentUserId = new AuthService().auth.userId;

  const message: Message = {
    systemMessageType: SystemMessageType.ConferenceCreated,
    text: Helpers.createSystemMessage({}),
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

  yield put(createMessageAction(createMessageRequest));
}

export function* getConferenceUsersSaga(action: ReturnType<typeof getConferenceUsersAction>): Iterator<any> {
  const { initiatedByScrolling } = action.payload;
  // @ts-ignore
  const { data }: AxiosResponse<Array<UserPreview>> = yield call(getConferenceUsersApi, action.payload);
  yield put(getConferenceUsersSuccessAction({ users: data, initiatedByScrolling: initiatedByScrolling }));
}

export function* leaveConferenceSaga(action: ReturnType<typeof leaveConferenceAction>): Iterator<any> {
  try {
    const dialog: Dialog = action.payload;

    // @ts-ignore
    const { status }: AxiosResponse = yield call(leaveConfereceApi, dialog.conference.id);
    if (status === HTTPStatusCode.OK) {
      yield put(leaveConferenceSuccessAction(action.payload));
      action.deferred?.resolve();
    } else {
      alert('Error. http status is ' + status);
    }
  } catch {
    alert('leaveConferenceSaga error');
  }
}

export function* renameConferenceSaga(action: ReturnType<typeof renameConferenceAction>): Iterator<any> {
  const { dialog, newName } = action.payload;
  // @ts-ignore
  const { status }: AxiosResponse = yield call(renameConferenceApi, { id: dialog.conference.id, name: newName });
  if (status === HTTPStatusCode.OK) {
    yield put(renameConferenceSuccessAction(action.payload));
    action.deferred?.resolve(dialog);
  } else {
    alert('renameConferenceSaga error');
  }
}
