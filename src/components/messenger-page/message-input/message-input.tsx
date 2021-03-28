import { LocalizationContext } from '@contexts';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { containsFiles, useGlobalDrop } from '@hooks/use-global-drop';
import { useOnClickOutside } from '@hooks/use-on-click-outside';
import { useReferState } from '@hooks/use-referred-state';
import { CreateMessage } from '@store/chats/features/create-message/create-message';
import { MessageTyping } from '@store/chats/features/message-typing/message-typing';
import { UploadAttachmentRequest } from '@store/chats/features/upload-attachment/upload-attachment-request';
import {
  SystemMessageType,
  MessageState,
  FileType,
  IMessage,
  MessageLinkType,
  IAttachmentCreation,
  IAttachmentToSend,
  IBaseAttachment,
} from '@store/chats/models';
import {
  getMessageToReplySelector,
  getSelectedChatSelector,
  getMessageToEditSelector,
} from '@store/chats/selectors';
import { myProfileSelector } from '@store/my-profile/selectors';
import { getTypingStrategySelector } from '@store/settings/selectors';
import { getFileType } from '@utils/get-file-extension';
import moment from 'moment';
import Mousetrap from 'mousetrap';
import React, { useContext, useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import useInterval from 'use-interval';
import { throttle } from 'lodash';
import { TypingStrategy } from '@store/settings/features/models';
import { loadMessageSmiles } from '@routing/module-loader';
import { CubeLoader } from '@containers/cube-loader/cube-loader';

import AddSvg from '@icons/add-attachment.svg';
import VoiceSvg from '@icons/voice.svg';
import CrayonSvg from '@icons/crayon.svg';
import SendSvg from '@icons/send.svg';
import CloseSvg from '@icons/close.svg';

import { SubmitEditMessage } from '@store/chats/features/edit-message/submit-edit-message';
import { RemoveAllAttachments } from '@store/chats/features/remove-attachment/remove-all-attachments';
import { RespondingMessage } from './responding-message/responding-message';
import { ExpandingTextarea } from './expanding-textarea/expanding-textarea';
import { MessageInputAttachment } from './message-input-attachment/message-input-attachment';

import './message-input.scss';
import { EditingMessage } from './editing-message/editing-message';
import { MessageError } from './message-error/message-error';

const MessageSmiles = lazy(loadMessageSmiles);

export interface IRecordedData {
  mediaRecorder: MediaRecorder | null;
  tracks: MediaStreamTrack[];
  isRecording: boolean;
  needToSubmit: boolean;
}

export const CreateMessageInput = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const sendMessage = useActionWithDispatch(CreateMessage.action);
  const notifyAboutTyping = useActionWithDispatch(MessageTyping.action);
  const uploadAttachmentRequest = useActionWithDispatch(UploadAttachmentRequest.action);
  const submitEditMessage = useActionWithDispatch(SubmitEditMessage.action);
  const removeAllAttachmentsToSend = useActionWithDispatch(RemoveAllAttachments.action);

  const currentUser = useSelector(myProfileSelector);
  const selectedChat = useSelector(getSelectedChatSelector);
  const myProfile = useSelector(myProfileSelector);
  const myTypingStrategy = useSelector(getTypingStrategySelector);
  const replyingMessage = useSelector(getMessageToReplySelector);
  const editingMessage = useSelector(getMessageToEditSelector);

  const refferedReplyingMessage = useReferState(replyingMessage);
  const updatedSelectedChat = useReferState(selectedChat);

  const [text, setText] = useState('');
  const refferedText = useReferState(text);
  const [isRecording, setIsRecording] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);

  // edit state logic
  const [removedAttachments, setRemovedAttachments] = useState<IAttachmentCreation[]>([]);
  const referredRemovedAttachments = useReferState(removedAttachments);

  const editingMessageAttachments = editingMessage?.attachments?.filter(
    ({ id }) =>
      removedAttachments.findIndex((removedAttachment) => removedAttachment.id === id) === -1,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const registerAudioBtnRef = useRef<HTMLButtonElement>(null);
  const recorderData = useRef<IRecordedData>({
    mediaRecorder: null,
    tracks: [],
    isRecording: false,
    needToSubmit: false,
  });

  useGlobalDrop({
    onDragEnter: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (containsFiles(e)) {
        setIsDragging(true);
      }
    },
    onDragOver: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (containsFiles(e)) {
        setIsDragging(true);
      }
    },
    onDragLeave: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
  });

  useEffect(() => {
    setText((oldText) =>
      typeof selectedChat?.draftMessage === 'string' ? selectedChat?.draftMessage : oldText,
    );
  }, [selectedChat?.id, setText]);

  useEffect(() => {
    setText(editingMessage?.text || '');
    setRemovedAttachments([]);
  }, [editingMessage?.text]);

  useInterval(
    () => {
      if (isRecording) {
        setRecordedSeconds((x) => x + 1);
      }
    },
    isRecording ? 1000 : null,
    true,
  );

  const submitEditedMessage = useCallback(() => {
    if(!editingMessage){
      return;
    }
    const newAttachments = updatedSelectedChat.current?.attachmentsToSend?.map(
      ({ attachment }) => attachment,
    );

    submitEditMessage({
      text: refferedText.current,
      removedAttachments: referredRemovedAttachments.current,
      newAttachments,
      messageId: editingMessage.id,
    });
  }, [refferedText, referredRemovedAttachments, editingMessage?.id]);

  const sendMessageToServer = () => {
    if (editingMessage) {
      submitEditedMessage();
      return;
    }

    const chatId = updatedSelectedChat.current?.id;

    const text = refferedText.current;

    if (
      (text.trim().length > 0 ||
        (updatedSelectedChat.current?.attachmentsToSend?.length || 0) > 0) &&
      updatedSelectedChat.current &&
      currentUser
    ) {
      const attachments = updatedSelectedChat.current?.attachmentsToSend?.map(
        ({ attachment }) => attachment,
      );

      if (chatId) {
        const message: IMessage = {
          text,
          systemMessageType: SystemMessageType.None,
          userCreator: currentUser,
          creationDateTime: new Date(new Date().toUTCString()),
          state: MessageState.QUEUED,
          id: new Date().getTime(),
          chatId,
          attachments,
          isDeleted: false,
          isEdited: false,
        };

        if (refferedReplyingMessage.current) {
          message.linkedMessage = refferedReplyingMessage.current;

          message.linkedMessageType = MessageLinkType.Reply;
        }
        sendMessage({
          message,
        });
      }
    }

    setText('');
  };

  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (containsFiles(e)) {
        setIsDraggingOver(true);
      }
    },
    [setIsDraggingOver],
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (containsFiles(e)) {
        setIsDraggingOver(true);
      }
    },
    [setIsDraggingOver],
  );

  const onDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
    },
    [setIsDraggingOver],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      if (e.dataTransfer?.files?.length > 0) {
        for (let index = 0; index < e.dataTransfer.files.length; ++index) {
          const file = e.dataTransfer?.files[index] as File;

          const fileType = getFileType(file.name);

          uploadAttachmentRequest({
            type: fileType,
            file,
            attachmentId: Number(`${new Date().getTime()}${index}`),
          });
        }
      }
    },
    [setIsDraggingOver, uploadAttachmentRequest],
  );

  const onPaste = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (event.clipboardData?.files.length > 0) {
        for (let index = 0; index < event.clipboardData?.files.length; ++index) {
          const file = event.clipboardData?.files.item(index) as File;

          // extension test
          const fileType = getFileType(file.name);

          uploadAttachmentRequest({
            type: fileType,
            file,
            attachmentId: Number(`${new Date().getTime()}${index}`),
          });
        }
      }
    },
    [uploadAttachmentRequest],
  );

  const throttledNotifyAboutTyping = useCallback(
    throttle((text: string) => {
      notifyAboutTyping({
        text,
      });
    }, 1000),
    [myProfile],
  );

  const onType = useCallback(
    (event) => {
      setText(event.target.value);

      throttledNotifyAboutTyping(event.target.value);
    },
    [setText, throttledNotifyAboutTyping],
  );

  const handleFocus = useCallback(() => {
    if (myTypingStrategy === TypingStrategy.Nle) {
      Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], () => {
        sendMessageToServer();
      });
      Mousetrap.bind('enter', (e) => {
        onType(e);
      });
    } else {
      Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], (e) => {
        setText((oldText) => `${oldText}\n`);
        onType(e);
      });
      Mousetrap.bind('enter', (e) => {
        e.preventDefault();
        sendMessageToServer();
      });
    }
  }, [setText, onType, sendMessageToServer, myTypingStrategy]);

  const handleBlur = useCallback(() => {
    Mousetrap.unbind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter']);
    Mousetrap.unbind('enter');
  }, []);

  const removeAttachment = useCallback(
    (attachmentToRemove: IAttachmentCreation) => {
      setRemovedAttachments((oldList) => [...oldList, attachmentToRemove]);
    },
    [setRemovedAttachments],
  );

  const removeAllAttachments = useCallback(() => {
    if (selectedChat?.attachmentsToSend?.length > 0) {
      removeAllAttachmentsToSend({
        ids: selectedChat?.attachmentsToSend?.map(({ attachment }) => attachment.id),
      });
    }

    setRemovedAttachments(
      () => editingMessage?.attachments?.map(({ id, type }) => ({ id, type })) || [],
    );
  }, [
    setRemovedAttachments,
    editingMessage,
    removeAllAttachmentsToSend,
    selectedChat?.attachmentsToSend,
  ]);

  const cancelRecording = useCallback(() => {
    Mousetrap.unbind('esc');
    recorderData.current.isRecording = false;
    recorderData.current.tracks.forEach((track) => track.stop());
    recorderData.current.tracks = [];
    recorderData.current.needToSubmit = false;
    if (recorderData.current.mediaRecorder?.state !== 'inactive') {
      recorderData.current.mediaRecorder?.stop();
    }
  }, [recorderData.current]);

  const startRecording = useCallback(() => {
    Mousetrap.bind('esc', cancelRecording);
    recorderData.current.tracks.forEach((track) => track.stop());
    recorderData.current.tracks = [];

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      recorderData.current.mediaRecorder = new MediaRecorder(stream);
      recorderData.current.mediaRecorder?.start();
      const tracks = stream.getTracks();
      recorderData.current.tracks.push(...tracks);

      recorderData.current.isRecording = true;
      setIsRecording(true);

      const audioChunks: Blob[] = [];
      recorderData.current.mediaRecorder?.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      recorderData.current.mediaRecorder?.addEventListener('stop', () => {
        setIsRecording(false);
        recorderData.current.isRecording = false;

        recorderData.current.tracks.forEach((track) => track.stop());
        recorderData.current.tracks = [];

        if (audioChunks[0]?.size > 0 && recorderData.current.needToSubmit) {
          const audioBlob = new Blob(audioChunks);
          const audioFile = new File([audioBlob], 'audio.mp3', {
            type: 'audio/mp3; codecs="opus"',
          });
          uploadAttachmentRequest({
            type: FileType.Voice,
            file: audioFile as File,
            attachmentId: new Date().getTime(),
          });
        }

        setRecordedSeconds(0);
      });
    });
  }, [setRecordedSeconds, uploadAttachmentRequest, recorderData.current]);

  const stopRecording = useCallback(() => {
    Mousetrap.unbind('esc');
    if (recorderData.current.isRecording) {
      if (recorderData.current.mediaRecorder?.state === 'recording') {
        recorderData.current.needToSubmit = true;
        recorderData.current.mediaRecorder?.stop();
      }

      recorderData.current.tracks.forEach((track) => track.stop());
      recorderData.current.tracks = [];
    }
  }, [recorderData.current]);

  useOnClickOutside(registerAudioBtnRef, cancelRecording);

  const handleRegisterAudioBtnClick = useCallback(() => {
    if (recorderData.current.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [startRecording, stopRecording, recorderData.current]);

  const openSelectFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const uploadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event?.target?.files && event.target.files.length > 0) {
        for (let index = 0; index < event.target.files.length; ++index) {
          const file = event.target.files.item(index) as File;

          const fileType = getFileType(file.name);

          uploadAttachmentRequest({
            type: fileType,
            file,
            attachmentId: Number(`${new Date().getTime()}${index}`),
          });
        }
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadAttachmentRequest, fileInputRef],
  );

  return (
    <div
      className="message-input"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}>
      {(editingMessageAttachments?.length > 0 || selectedChat?.attachmentsToSend?.length > 0) && (
        <div className="message-input__attachments-box">
          <div className="message-input__attachments-box__container">
            {editingMessageAttachments?.map((attachment) => (
              <MessageInputAttachment
                attachment={{ attachment } as IAttachmentToSend<IBaseAttachment>}
                isFromEdit
                removeSelectedAttachment={removeAttachment}
                key={attachment.id}
              />
            ))}
            {selectedChat?.attachmentsToSend?.map((attachment) => (
              <MessageInputAttachment attachment={attachment} key={attachment.attachment.id} />
            ))}
          </div>
          <button
            onClick={removeAllAttachments}
            type="button"
            className="message-input__attachments-box__delete-all">
            <CloseSvg viewBox="0 0 24 24" />
          </button>
        </div>
      )}

      {(isDragging || isDraggingOver) && (
        <div
          className={`message-input__drag ${isDraggingOver ? 'message-input__drag--active' : ''}`}>
          Drop files here to send them
        </div>
      )}
      {selectedChat && !(isDragging || isDraggingOver) && (
        <>
          {replyingMessage && <RespondingMessage />}
          {editingMessage && <EditingMessage />}
          {false && <MessageError />}
          <div className="message-input__send-message">
            {!isRecording && (
              <>
                <input multiple hidden type="file" onChange={uploadFile} ref={fileInputRef} />
                <button type="button" onClick={openSelectFiles} className="message-input__add">
                  <AddSvg />
                </button>
                <div className="message-input__line" />
                <CrayonSvg width={22} viewBox="0 0 16 16" className="message-input__crayon" />
              </>
            )}

            {isRecording && (
              <>
                <div className="message-input__red-dot" />
                <div className="message-input__counter">
                  {moment.utc(recordedSeconds * 1000).format('mm:ss')}
                </div>
              </>
            )}

            {!isRecording && (
              <ExpandingTextarea
                value={text}
                placeholder={t('messageInput.write')}
                onChange={onType}
                onPaste={onPaste}
                className="mousetrap message-input__input-message"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            )}

            {isRecording && (
              <div className="message-input__recording-info">
                Release outside this field to cancel
              </div>
            )}

            <div className="message-input__right-btns">
              {!isRecording && (
                <Suspense fallback={<CubeLoader />}>
                  <MessageSmiles setText={setText} />
                </Suspense>
              )}

              <button
                type="button"
                onClick={handleRegisterAudioBtnClick}
                ref={registerAudioBtnRef}
                className="message-input__voice-btn">
                <VoiceSvg viewBox="0 0 20 24" />
              </button>

              {!isRecording && (
                <button
                  type="button"
                  onClick={sendMessageToServer}
                  className="message-input__send-btn">
                  <SendSvg />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
});
