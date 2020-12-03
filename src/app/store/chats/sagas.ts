import { FileType } from 'store/messages/models';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { AxiosResponse, CancelTokenSource } from 'axios';
import { SagaIterator } from 'redux-saga';
import { CreateGroupChat } from './features/create-group-chat';
import { UploadAttachmentSagaProgressData, BaseAttachment } from './models';
import { ChatHttpFileRequest } from './http-requests';
import { IFilesRequestGenerator } from '../common/http-file-factory';
import { AddUsersToGroupChat } from './features/add-users-to-group-chat';
import { ChangeChatVisibilityState } from './features/change-chat-visibility-state';
import { ChangeSelectedChat } from './features/change-selected-chat';
import { CreateGroupChatFromEvent } from './features/create-group-chat-from-event';
import { EditGroupChat } from './features/edit-group-chat';
import { GetAudioAttachments } from './features/get-audio-attachments';
import { GetChatInfo } from './features/get-chat-info';
import { GetChats } from './features/get-chats';
import { GetGroupChatUsers } from './features/get-group-chat-users';
import { GetPhotoAttachments } from './features/get-photo-attachments';
import { GetRawAttachments } from './features/get-raw-attachments';
import { GetVideoAttachments } from './features/get-video-attachments';
import { GetVoiceAttachments } from './features/get-voice-attachments';
import { LeaveGroupChat } from './features/leave-group-chat';
import { MarkMessagesAsRead } from './features/mark-messages-as-read';
import { MuteChat } from './features/mute-chat';
import { RemoveAttachment } from './features/remove-attachment';
import { UploadAttachmentFailure } from './features/upload-attachment-failure';
import { UploadAttachmentProgress } from './features/upload-attachment-progress';
import { UploadAttachmentRequest } from './features/upload-attachment-request';
import { UploadAttachmentSuccess } from './features/upload-attachment-success';

let uploadingAttachments: { id: number; cancelTokenSource: CancelTokenSource }[] = [];

// Upload the specified file
export function* uploadAttachmentSaga(action: ReturnType<typeof UploadAttachmentRequest.action>): SagaIterator {
  const { file, type, chatId, attachmentId } = action.payload;
  let uploadRequest: IFilesRequestGenerator<AxiosResponse<any>, any>;

  switch (type) {
    case FileType.audio:
      uploadRequest = ChatHttpFileRequest.uploadAudioAttachment;

      break;
    case FileType.raw:
      uploadRequest = ChatHttpFileRequest.uploadFileAttachment;

      break;
    case FileType.picture:
      uploadRequest = ChatHttpFileRequest.uploadPictureAttachment;

      break;
    case FileType.voice:
      uploadRequest = ChatHttpFileRequest.uploadVoiceAttachment;

      break;
    case FileType.video:
      uploadRequest = ChatHttpFileRequest.uploadVideoAttachment;

      break;
    default:
      break;
  }

  const data = new FormData();

  const uploadData = { file };

  Object.entries(uploadData).forEach((k) => {
    data.append(k[0], k[1]);
  });

  yield call(() =>
    uploadRequest.generator(data, {
      *onStart({ cancelTokenSource }): SagaIterator {
        uploadingAttachments.push({ cancelTokenSource, id: attachmentId });
      },
      *onProgress(payload: UploadAttachmentSagaProgressData): SagaIterator {
        yield put(UploadAttachmentProgress.action({ chatId, attachmentId, ...payload }));
      },
      *onSuccess(payload: BaseAttachment): SagaIterator {
        uploadingAttachments = uploadingAttachments.filter(({ id }) => id === attachmentId);

        yield put(
          UploadAttachmentSuccess.action({
            chatId,
            attachmentId,
            attachment: payload,
          }),
        );
      },
      *onFailure(): SagaIterator {
        uploadingAttachments = uploadingAttachments.filter(({ id }) => id === attachmentId);
        yield put(UploadAttachmentFailure.action({ chatId, attachmentId }));
      },
    }),
  );
}

function* cancelUploadSaga(action: ReturnType<typeof RemoveAttachment.action>): SagaIterator {
  const { attachmentId } = action.payload;

  const uploadingAttachment = uploadingAttachments.find(({ id }) => id === attachmentId);

  uploadingAttachment?.cancelTokenSource.cancel();
}

export const ChatSagas = [
  takeLatest(GetChats.action, GetChats.saga),
  takeLatest(LeaveGroupChat.action, LeaveGroupChat.saga),
  takeLatest(GetGroupChatUsers.action, GetGroupChatUsers.saga),
  takeLatest(CreateGroupChatFromEvent.action, CreateGroupChatFromEvent.saga),
  takeLatest(CreateGroupChat.action, CreateGroupChat.saga),
  takeLatest(ChangeChatVisibilityState.action, ChangeChatVisibilityState.saga),
  takeLatest(AddUsersToGroupChat.action, AddUsersToGroupChat.saga),
  takeLatest(MuteChat.action, MuteChat.saga),
  takeLatest(GetPhotoAttachments.action, GetPhotoAttachments.saga),
  takeLatest(GetVideoAttachments.action, GetVideoAttachments.saga),
  takeLatest(GetRawAttachments.action, GetRawAttachments.saga),
  takeLatest(GetVoiceAttachments.action, GetVoiceAttachments.saga),
  takeLatest(GetAudioAttachments.action, GetAudioAttachments.saga),
  takeLatest(MarkMessagesAsRead.action, MarkMessagesAsRead.saga),
  takeLatest(GetChatInfo.action, GetChatInfo.saga),
  takeLatest(ChangeSelectedChat.action, ChangeSelectedChat.saga),
  takeLatest(EditGroupChat.action, EditGroupChat.saga),
  takeEvery(UploadAttachmentRequest.action, uploadAttachmentSaga),
  takeEvery(RemoveAttachment.action, cancelUploadSaga),
];
