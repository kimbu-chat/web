import React, { useState, useRef, useEffect, useCallback } from 'react';

import throttle from 'lodash/throttle';
import Mousetrap from 'mousetrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import usePrevious from '@hooks/use-previous';
import { useReferState } from '@hooks/use-referred-state';
import { ReactComponent as AddSvg } from '@icons/add-attachment.svg';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as SendSvg } from '@icons/send.svg';
import { ReactComponent as VoiceSvg } from '@icons/voice.svg';
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
import { TypingStrategy } from '@store/settings/features/models';
import { getTypingStrategySelector } from '@store/settings/selectors';
import { MESSAGE_INPUT_ID } from '@utils/constants';
import { focusEditableElement } from '@utils/focus-editable-element';
import { getFileType } from '@utils/get-file-extension';
import { parseMessageInput } from '@utils/parse-message-input';
import renderText from '@utils/render-text/render-text';
import { isSelectionInsideInput } from '@utils/selection';

import { insertHtmlInSelection } from '../../utils/insert-html-in-selection';

import { EditingMessage } from './editing-message/editing-message';
import { MessageError } from './message-error/message-error';
import { MessageInputAttachment } from './message-input-attachment/message-input-attachment';
import { MessageSmiles } from './message-smiles/message-smiles';
import { RecordingMessage } from './recording-message/recording-message';
import { RespondingMessage } from './responding-message/responding-message';

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
  const previousChatId = usePrevious(selectedChat?.id);
  const myTypingStrategy = useSelector(getTypingStrategySelector);
  const replyingMessage = useSelector(getMessageToReplySelector);
  const editingMessage = useSelector(getMessageToEditSelector);

  const refferedReplyingMessage = useReferState(replyingMessage);
  const updatedSelectedChat = useReferState(selectedChat);

  const [text, setText] = useState('');
  const refferedText = useReferState(text);
  const [isRecording, setIsRecording] = useState(false);

  const messageInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageInputRef.current?.focus();
  }, [selectedChat?.id, replyingMessage, editingMessage]);

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

  const insertTextAndUpdateCursor = useCallback(
    (textToInsert: string) => {
      const selection = window.getSelection();
      const messageInput = messageInputRef.current;

      if (messageInput) {
        const newHtml = renderText(textToInsert, ['escape_html', 'emoji_html', 'br_html'])
          .join('')
          .replace(/\u200b+/g, '\u200b');

        if (selection && selection.rangeCount) {
          const selectionRange = selection.getRangeAt(0);
          if (isSelectionInsideInput(selectionRange, MESSAGE_INPUT_ID)) {
            insertHtmlInSelection(newHtml);
            messageInput.dispatchEvent(new Event('input', { bubbles: true }));
            return;
          }
        }

        setText(`${refferedText.current}${newHtml}`);

        // If selection is outside of input, set cursor at the end of input
        requestAnimationFrame(() => {
          focusEditableElement(messageInput);
        });
      }
    },
    [refferedText],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText((oldText) => {
      const newText =
        typeof selectedChat?.draftMessage === 'string' ? selectedChat?.draftMessage : oldText;

      if (previousChatId !== selectedChat?.id && messageInputRef.current) {
        messageInputRef.current.innerHTML = '';
        insertHtmlInSelection(newText);
      }

      return newText;
    });
  }, [previousChatId, selectedChat?.draftMessage, selectedChat?.id, setText]);

  useEffect(() => {
    const newText = editingMessage?.text || '';

    if (messageInputRef.current) {
      messageInputRef.current.innerHTML = '';

      insertTextAndUpdateCursor(newText);
    }
    setRemovedAttachments(undefined);
  }, [editingMessage?.text, insertTextAndUpdateCursor]);

  const submitEditedMessage = useCallback(() => {
    const newAttachments = updatedSelectedChat.current?.attachmentsToSend?.map(
      ({ attachment }) => attachment,
    );

    submitEditMessage({
      text: parseMessageInput(refferedText.current),
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

    const messageText = parseMessageInput(refferedText.current);

    if (
      (messageText.trim().length > 0 ||
        (updatedSelectedChat.current?.attachmentsToSend?.length || 0) > 0) &&
      updatedSelectedChat.current &&
      currentUserId
    ) {
      const attachments = updatedSelectedChat.current?.attachmentsToSend?.map(
        ({ attachment }) => attachment,
      );

      if (chatId) {
        const message: INormalizedMessage = {
          text: messageText,
          systemMessageType: SystemMessageType.None,
          userCreatorId: currentUserId,
          creationDateTime: new Date().toISOString(),
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
    if (messageInputRef.current) {
      messageInputRef.current.innerHTML = '';
    }
  }, [
    currentUserId,
    editingMessage,
    refferedReplyingMessage,
    refferedText,
    sendMessage,
    submitEditedMessage,
    updatedSelectedChat,
  ]);

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
      setText(event.target.innerHTML);

      throttledNotifyAboutTyping(event.target.innerHTML);
    },
    [setText, throttledNotifyAboutTyping],
  );

  const handleFocus = useCallback(() => {
    if (myTypingStrategy === TypingStrategy.Nle) {
      Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], () => {
        sendMessageToServer();
      });
      Mousetrap.bind('enter', () => {
        insertHtmlInSelection('<br /><br />');
      });
    } else {
      Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], (e) => {
        insertHtmlInSelection('<br /><br />');
        onType(e);
      });
      Mousetrap.bind('enter', (e) => {
        e.preventDefault();
        sendMessageToServer();
      });
    }
  }, [onType, sendMessageToServer, myTypingStrategy]);

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

  const onPaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();

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

      const pastedText = event.clipboardData.getData('text');

      if (pastedText) {
        insertTextAndUpdateCursor(pastedText);
      }
    },
    [insertTextAndUpdateCursor, uploadAttachmentRequest],
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
                <input type="file" multiple hidden onChange={uploadFile} ref={fileInputRef} />
                <button type="button" onClick={openSelectFiles} className="message-input__add">
                  <AddSvg />
                </button>
                <div className="message-input__line" />
                <div
                  id={MESSAGE_INPUT_ID}
                  contentEditable
                  placeholder={t('messageInput.write')}
                  ref={messageInputRef}
                  onInput={onType}
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
                  <MessageSmiles onSelectEmoji={insertTextAndUpdateCursor} />

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
