import { useTranslation } from 'react-i18next';
import Mousetrap from 'mousetrap';
import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSelector } from 'react-redux';
import throttle from 'lodash/throttle';

import { useReferState } from '@hooks/use-referred-state';
import {
  messageTypingAction,
  createMessageAction,
  uploadAttachmentRequestAction,
  submitEditMessageAction,
  removeAllAttachmentsAction,
} from '@store/chats/actions';
import {
  SystemMessageType,
  MessageState,
  MessageLinkType,
  IAttachmentCreation,
  IAttachmentToSend,
  IBaseAttachment,
  INormalizedMessage,
} from '@store/chats/models';
import {
  getMessageToReplySelector,
  getSelectedChatSelector,
  getMessageToEditSelector,
} from '@store/chats/selectors';
import { myIdSelector } from '@store/my-profile/selectors';
import { getTypingStrategySelector } from '@store/settings/selectors';
import { getFileType } from '@utils/get-file-extension';
import { TypingStrategy } from '@store/settings/features/models';
import { CubeLoader } from '@components/cube-loader';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as AddSvg } from '@icons/add-attachment.svg';
import { ReactComponent as VoiceSvg } from '@icons/voice.svg';
import { ReactComponent as SendSvg } from '@icons/send.svg';
import { ReactComponent as CloseSvg } from '@icons/close.svg';

import { RespondingMessage } from './responding-message/responding-message';
import { ExpandingTextarea } from './expanding-textarea/expanding-textarea';
import { MessageInputAttachment } from './message-input-attachment/message-input-attachment';
import { EditingMessage } from './editing-message/editing-message';
import { MessageError } from './message-error/message-error';
import { MessageSmiles } from './message-smiles/message-smiles';
import { RecordingMessage } from './recording-message/recording-message';

import './message-input.scss';

const CreateMessageInput = () => {
  const { t } = useTranslation();

  const sendMessage = useActionWithDispatch(createMessageAction);
  const notifyAboutTyping = useActionWithDispatch(messageTypingAction);
  const uploadAttachmentRequest = useActionWithDispatch(uploadAttachmentRequestAction);
  const submitEditMessage = useActionWithDispatch(submitEditMessageAction);
  const removeAllAttachmentsToSend = useActionWithDispatch(removeAllAttachmentsAction);

  const currentUserId = useSelector(myIdSelector);
  const selectedChat = useSelector(getSelectedChatSelector);
  const myTypingStrategy = useSelector(getTypingStrategySelector);
  const replyingMessage = useSelector(getMessageToReplySelector);
  const editingMessage = useSelector(getMessageToEditSelector);

  const refferedReplyingMessage = useReferState(replyingMessage);
  const updatedSelectedChat = useReferState(selectedChat);

  const [text, setText] = useState('');
  const refferedText = useReferState(text);
  const [isRecording, setIsRecording] = useState(false);

  // edit state logic
  const [removedAttachments, setRemovedAttachments] = useState<IAttachmentCreation[] | undefined>(
    undefined,
  );
  const referredRemovedAttachments = useReferState(removedAttachments);

  const editingMessageAttachments = editingMessage?.attachments?.filter(({ id }) => {
    if (!removedAttachments) {
      return true;
    }

    const res =
      removedAttachments?.findIndex((removedAttachment) => removedAttachment.id === id) === -1;

    return res;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText((oldText) =>
      typeof selectedChat?.draftMessage === 'string' ? selectedChat?.draftMessage : oldText,
    );
  }, [selectedChat?.draftMessage, selectedChat?.id, setText]);

  useEffect(() => {
    setText(editingMessage?.text || '');
    setRemovedAttachments(undefined);
  }, [editingMessage?.text]);

  const submitEditedMessage = useCallback(() => {
    const newAttachments = updatedSelectedChat.current?.attachmentsToSend?.map(
      ({ attachment }) => attachment,
    );

    submitEditMessage({
      text: refferedText.current,
      removedAttachments: referredRemovedAttachments.current,
      newAttachments,
      messageId: editingMessage?.id as number,
    });
  }, [
    updatedSelectedChat,
    submitEditMessage,
    refferedText,
    referredRemovedAttachments,
    editingMessage,
  ]);

  const sendMessageToServer = useCallback(() => {
    if (editingMessage) {
      submitEditedMessage();
      return;
    }

    const chatId = updatedSelectedChat.current?.id;

    const refText = refferedText.current;

    if (
      (refText.trim().length > 0 ||
        (updatedSelectedChat.current?.attachmentsToSend?.length || 0) > 0) &&
      updatedSelectedChat.current &&
      currentUserId
    ) {
      const attachments = updatedSelectedChat.current?.attachmentsToSend?.map(
        ({ attachment }) => attachment,
      );

      if (chatId) {
        const message: INormalizedMessage = {
          text: refText,
          systemMessageType: SystemMessageType.None,
          userCreatorId: currentUserId,
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
  }, [
    currentUserId,
    editingMessage,
    refferedReplyingMessage,
    refferedText,
    sendMessage,
    submitEditedMessage,
    updatedSelectedChat,
  ]);

  const onPaste = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (event.clipboardData.files.length > 0) {
        for (let index = 0; index < event.clipboardData.files.length; index += 1) {
          const file = event.clipboardData.files.item(index) as File;

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

  const throttledNotifyAboutTyping = useRef(
    throttle(
      (notificationText: string) => {
        notifyAboutTyping({
          text: notificationText,
        });
      },
      1000,
      { leading: true, trailing: false },
    ),
  ).current;

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
      setRemovedAttachments((oldList) => [...(oldList || []), attachmentToRemove]);
    },
    [setRemovedAttachments],
  );

  const removeAllAttachments = useCallback(() => {
    if (selectedChat?.attachmentsToSend && selectedChat?.attachmentsToSend?.length > 0) {
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

  const handleRegisterAudioBtnClick = useCallback(() => {
    setIsRecording((oldState) => !oldState);
  }, [setIsRecording]);

  const openSelectFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const uploadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        for (let index = 0; index < event.target.files.length; index += 1) {
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
    <div className="message-input">
      {selectedChat && (
        <>
          {replyingMessage && <RespondingMessage />}
          {editingMessage && <EditingMessage />}
          {((editingMessageAttachments && editingMessageAttachments?.length > 0) ||
            (selectedChat?.attachmentsToSend && selectedChat?.attachmentsToSend?.length > 0)) && (
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
          {false && <MessageError />}
          <div className="message-input__send-message">
            {isRecording ? (
              <RecordingMessage hide={handleRegisterAudioBtnClick} />
            ) : (
              <>
                <input multiple hidden type="file" onChange={uploadFile} ref={fileInputRef} />
                <button type="button" onClick={openSelectFiles} className="message-input__add">
                  <AddSvg />
                </button>
                <div className="message-input__line" />
                <ExpandingTextarea
                  value={text}
                  placeholder={t('messageInput.write')}
                  onChange={onType}
                  onPaste={onPaste}
                  className="mousetrap message-input__input-message"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </>
            )}

            <div className="message-input__right-btns">
              {!isRecording && (
                <>
                  <Suspense fallback={<CubeLoader />}>
                    <MessageSmiles setText={setText} />
                  </Suspense>

                  <button
                    type="button"
                    onClick={handleRegisterAudioBtnClick}
                    className="message-input__voice-btn">
                    <VoiceSvg viewBox="0 0 20 24" />
                  </button>

                  <button
                    type="button"
                    onClick={sendMessageToServer}
                    className="message-input__send-btn">
                    <SendSvg />
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

CreateMessageInput.displayName = 'CreateMessageInput';

export { CreateMessageInput };
