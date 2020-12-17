import React, { useState, useRef, useContext, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './message-input.scss';

import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { MessageActions } from 'store/messages/actions';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { SystemMessageType, MessageState, FileType } from 'store/messages/models';
import { LocalizationContext } from 'app/app';
import useInterval from 'use-interval';

import AddSvg from 'icons/ic-add-new.svg';
import VoiceSvg from 'icons/ic-microphone.svg';
import moment from 'moment';

import { getMyProfileSelector } from 'store/my-profile/selectors';
import Mousetrap from 'mousetrap';
import { getTypingStrategy } from 'store/settings/selectors';
import { TypingStrategy } from 'store/settings/models';
import { ChatActions } from 'store/chats/actions';
import useOnClickOutside from 'utils/hooks/use-on-click-outside';
import { getFileType } from 'utils/functions/get-file-extension';
import { RespondingMessage } from 'components';
import { Chat } from 'store/chats/models';
import { useGlobalDrop } from 'utils/hooks/use-drop';
import useReferState from 'utils/hooks/use-referred-state';
import { throttle } from 'lodash';
import { getMessageToReply } from 'app/store/messages/selectors';
import { MessageInputAttachment } from './message-input-attachment/message-input-attachment';
import { MessageSmiles } from './message-smiles/message-smiles';
import { ExpandingTextarea } from './expanding-textarea/expanding-textarea';

namespace CreateMessageInputNS {
  export interface RecordedData {
    mediaRecorder: MediaRecorder | null;
    tracks: MediaStreamTrack[];
    isRecording: boolean;
    needToSubmit: boolean;
  }
}

export const CreateMessageInput = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const sendMessage = useActionWithDispatch(MessageActions.createMessage);
  const notifyAboutTyping = useActionWithDispatch(MessageActions.messageTyping);
  const uploadAttachmentRequest = useActionWithDispatch(ChatActions.uploadAttachmentRequestAction);

  const currentUser = useSelector(getMyProfileSelector);
  const selectedChat = useSelector(getSelectedChatSelector);
  const myProfile = useSelector(getMyProfileSelector);
  const myTypingStrategy = useSelector(getTypingStrategy);
  const replyingMessage = useSelector(getMessageToReply);

  const [text, setText] = useState('');
  const refferedText = useReferState(text);
  const [isRecording, setIsRecording] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const registerAudioBtnRef = useRef<HTMLButtonElement>(null);
  const recorderData = useRef<CreateMessageInputNS.RecordedData>({
    mediaRecorder: null,
    tracks: [],
    isRecording: false,
    needToSubmit: false,
  });
  const updatedSelectedChat = useRef<Chat | undefined>();

  useGlobalDrop({
    onDragEnter: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    onDragOver: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    onDragLeave: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
  });

  useEffect(() => {
    updatedSelectedChat.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    setText((oldText) => (typeof selectedChat?.draftMessage === 'string' ? selectedChat?.draftMessage : oldText));
  }, [selectedChat?.id, setText]);

  useInterval(
    () => {
      if (isRecording) {
        setRecordedSeconds((x) => x + 1);
      }
    },
    isRecording ? 1000 : null,
    true,
  );

  const sendMessageToServer = () => {
    const chatId = updatedSelectedChat.current?.id;

    const text = refferedText.current;

    if (text.trim().length > 0 && updatedSelectedChat.current && currentUser) {
      const attachments = updatedSelectedChat.current?.attachmentsToSend?.map(({ attachment }) => attachment);

      sendMessage({
        chatId: updatedSelectedChat.current!.id,
        message: {
          text,
          systemMessageType: SystemMessageType.None,
          userCreator: currentUser,
          creationDateTime: new Date(new Date().toUTCString()),
          state: MessageState.QUEUED,
          id: new Date().getTime(),
          chatId,
          attachments,
        },
      });
    }

    setText('');
  };

  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
    },
    [setIsDraggingOver],
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
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

      if (e.dataTransfer?.files?.length! > 0) {
        for (let index = 0; index < e.dataTransfer!.files!.length; ++index) {
          const file = e.dataTransfer?.files[index] as File;

          const fileType = getFileType(file.name);

          uploadAttachmentRequest({
            chatId: selectedChat!.id,
            type: fileType,
            file,
            attachmentId: Number(`${new Date().getTime()}${index}`),
          });
        }
      }
    },
    [setIsDraggingOver, selectedChat?.id, uploadAttachmentRequest],
  );

  const onPaste = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (event.clipboardData?.files.length! > 0) {
        for (let index = 0; index < event.clipboardData?.files.length!; ++index) {
          const file = event.clipboardData?.files!.item(index) as File;

          // extension test
          const fileType = getFileType(file.name);

          uploadAttachmentRequest({
            chatId: selectedChat!.id,
            type: fileType,
            file,
            attachmentId: Number(`${new Date().getTime()}${index}`),
          });
        }
      }
    },
    [uploadAttachmentRequest, selectedChat?.id],
  );

  const throttledNotifyAboutTyping = useCallback(
    throttle((text: string) => {
      notifyAboutTyping({
        chatId: selectedChat?.id!,
        text,
        interlocutorName: `${myProfile?.firstName} ${myProfile?.lastName}`,
      });
    }, 1000),
    [selectedChat?.id, myProfile],
  );

  const onType = useCallback(
    (event) => {
      setText(event.target.value);

      throttledNotifyAboutTyping(event.target.value);
    },
    [setText, throttledNotifyAboutTyping],
  );

  const handleFocus = useCallback(() => {
    if (myTypingStrategy === TypingStrategy.nle) {
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
            chatId: selectedChat!.id,
            type: FileType.voice,
            file: audioFile as File,
            attachmentId: new Date().getTime(),
          });
        }

        setRecordedSeconds(0);
      });
    });
  }, [selectedChat, setRecordedSeconds, uploadAttachmentRequest, recorderData.current]);

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
      if (event.target.files?.length! > 0) {
        for (let index = 0; index < event.target.files!.length; ++index) {
          const file = event.target.files!.item(index) as File;

          const fileType = getFileType(file.name);

          uploadAttachmentRequest({
            chatId: selectedChat!.id,
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
    [uploadAttachmentRequest, selectedChat, fileInputRef],
  );

  return (
    <div className='message-input' onDrop={onDrop} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
      {selectedChat?.attachmentsToSend?.map((attachment) => (
        <MessageInputAttachment attachment={attachment} key={attachment.attachment.id} />
      ))}

      {(isDragging || isDraggingOver) && (
        <div className={`message-input__drag ${isDraggingOver ? 'message-input__drag--active' : ''}`}>Drop files here to send them</div>
      )}

      {selectedChat && !(isDragging || isDraggingOver) && (
        <>
          {replyingMessage && <RespondingMessage />}
          <div className='message-input__send-message'>
            {!isRecording && (
              <>
                <input multiple className='hidden' type='file' onChange={uploadFile} ref={fileInputRef} />
                <button type='button' onClick={openSelectFiles} className='message-input__add'>
                  <AddSvg />
                </button>
              </>
            )}
            {isRecording && (
              <>
                <div className='message-input__red-dot' />
                <div className='message-input__counter'>{moment.utc(recordedSeconds * 1000).format('mm:ss')}</div>
              </>
            )}
            <div className='message-input__input-group'>
              {!isRecording && (
                <ExpandingTextarea
                  value={text}
                  placeholder={t('messageInput.write')}
                  onChange={onType}
                  onPaste={onPaste}
                  className='mousetrap message-input__input-message'
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              )}
              {isRecording && <div className='message-input__recording-info'>Release outside this field to cancel</div>}
              <div className='message-input__right-btns'>
                {!isRecording && <MessageSmiles setText={setText} />}
                <button
                  type='button'
                  onClick={handleRegisterAudioBtnClick}
                  ref={registerAudioBtnRef}
                  className={`message-input__voice-btn ${isRecording ? 'message-input__voice-btn--active' : ''}`}
                >
                  <VoiceSvg />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
