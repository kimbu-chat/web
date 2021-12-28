import React, { useCallback, useEffect, useRef, useState } from 'react';

import { IAttachmentBase, MessageLinkType, SystemMessageType } from 'kimbu-models';
import map from 'lodash/map';
import size from 'lodash/size';
import throttle from 'lodash/throttle';
import Mousetrap from 'mousetrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { INPUT_MAX_LENGTH } from '@components/message-input/constants';
import { inputUtils } from '@components/message-input/utilities/input-utilities';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import usePrevious from '@hooks/use-previous';
import { useReferState } from '@hooks/use-referred-state';
import { ReactComponent as AddSvg } from '@icons/add-attachment.svg';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import { ReactComponent as SendSvg } from '@icons/send.svg';
import { ReactComponent as VoiceSvg } from '@icons/voice.svg';
import { Button } from '@shared-components/button';
import {
  createMessageAction,
  messageTypingAction,
  removeAllAttachmentsAction,
  submitEditMessageAction,
  uploadAttachmentRequestAction,
} from '@store/chats/actions';
import {
  IAttachmentCreation,
  IAttachmentToSend,
  INormalizedMessage,
  MessageState,
} from '@store/chats/models';
import {
  getMessageToEditSelector,
  getMessageToReplySelector,
  getSelectedChatSelector,
} from '@store/chats/selectors';
import { myIdSelector } from '@store/my-profile/selectors';
import { TypingStrategy } from '@store/settings/features/models';
import { getTypingStrategySelector } from '@store/settings/selectors';
import { MESSAGE_INPUT_ID } from '@utils/constants';
import { focusEditableElement } from '@utils/focus-editable-element';
import { getAttachmentType } from '@utils/get-file-extension';
import { insertHtmlInSelection } from '@utils/insert-html-in-selection';
import { parseMessageInput } from '@utils/parse-message-input';
import { setRecordAudioStream } from '@utils/record-audio-stream';
import renderText from '@utils/render-text/render-text';
import { isSelectionInsideInput } from '@utils/selection';

import { EditingMessage } from './editing-message/editing-message';
import { MessageError } from './message-error/message-error';
import { MessageInputAttachment } from './message-input-attachment/message-input-attachment';
import { MessageSmiles } from './message-smiles/message-smiles';
import { RecordingMessage } from './recording-message/recording-message';
import { RespondingMessage } from './responding-message/responding-message';

import './message-input.scss';

const CreateMessageInput = () => {
  const { t } = useTranslation();
  const draftMessageId = useRef(new Date().getTime());

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
  const referredText = useReferState(text);
  const [requestMicrophoneLoading, setRequestMicrophoneLoading] = useState(false);
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

  const editingMessageAttachments = editingMessage?.attachments?.filter(
    ({ id }: { id: number }) => {
      if (!removedAttachments) {
        return true;
      }

      return (
        removedAttachments?.findIndex((removedAttachment) => removedAttachment.id === id) === -1
      );
    },
  );

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

        setText(`${referredText.current}${newHtml}`);

        // If selection is outside of input, set cursor at the end of input
        requestAnimationFrame(() => {
          focusEditableElement(messageInput);
        });
      }
    },
    [referredText],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText((oldText) => {
      const newText =
        typeof selectedChat?.draftMessages[draftMessageId.current]?.text === 'string'
          ? selectedChat?.draftMessages[draftMessageId.current].text
          : oldText;

      if (previousChatId !== selectedChat?.id && messageInputRef.current) {
        messageInputRef.current.innerHTML = '';
        insertHtmlInSelection(newText);
      }

      return newText;
    });
  }, [
    previousChatId,
    selectedChat?.draftMessages[draftMessageId.current],
    selectedChat?.id,
    setText,
  ]);

  useEffect(() => {
    const newText = editingMessage?.text || '';

    if (messageInputRef.current) {
      messageInputRef.current.innerHTML = '';

      insertTextAndUpdateCursor(newText);
    }
    setRemovedAttachments(undefined);
  }, [editingMessage?.text, insertTextAndUpdateCursor]);

  const submitEditedMessage = useCallback(() => {
    const newAttachments = updatedSelectedChat.current?.draftMessages[
      draftMessageId.current
    ]?.attachmentsToSend?.map(({ attachment }) => attachment);

    if (editingMessage?.id) {
      submitEditMessage({
        text: parseMessageInput(referredText.current),
        removedAttachments: referredRemovedAttachments.current,
        newAttachments,
        messageId: editingMessage.id,
      });
    }
  }, [
    updatedSelectedChat,
    submitEditMessage,
    referredText,
    referredRemovedAttachments,
    editingMessage,
  ]);

  const sendMessageToServer = useCallback(() => {
    if (editingMessage) {
      submitEditedMessage();
      return;
    }

    const chatId = updatedSelectedChat.current?.id;

    const messageText = parseMessageInput(referredText.current);

    if (
      (messageText.trim().length > 0 || size(updatedSelectedChat.current?.attachmentsToSend) > 0) &&
      updatedSelectedChat.current &&
      currentUserId
    ) {
      const attachments = map(
        updatedSelectedChat.current?.draftMessages[draftMessageId.current]?.attachmentsToSend,
        'attachment',
      );

      if (chatId) {
        const message: INormalizedMessage = {
          text: messageText,
          systemMessageType: SystemMessageType.None,
          userCreatorId: currentUserId,
          creationDateTime: new Date().toISOString(),
          state: MessageState.QUEUED,
          id: draftMessageId.current,
          chatId,
          attachments,
          isDeleted: false,
          isEdited: false,
        };

        if (refferedReplyingMessage.current) {
          const {
            current: referMessage,
            current: { linkedMessageType, linkedMessage },
          } = refferedReplyingMessage;
          message.linkedMessage =
            linkedMessageType === MessageLinkType.Forward ? linkedMessage : referMessage;

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
    referredText,
    sendMessage,
    submitEditedMessage,
    updatedSelectedChat,
  ]);

  const throttledNotifyAboutTyping = useRef(
    throttle(
      (notificationText: string) => {
        notifyAboutTyping({
          id: draftMessageId.current,
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

  const onKeyDown = useCallback((event) => {
    const isSpecial = inputUtils.isSpecial(event);
    const isNavigational = inputUtils.isNavigational(event);
    let hasSelection = false;
    const selection = window.getSelection();

    if (selection) {
      hasSelection = !!selection.toString();
    }

    if (isSpecial || isNavigational) {
      return true;
    }

    if (inputUtils.isShortCut(event)) {
      return true;
    }

    if (event.target.innerHTML.length >= INPUT_MAX_LENGTH && !hasSelection) {
      event.preventDefault();
      return false;
    }

    return true;
  }, []);

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
    const attachments = selectedChat?.draftMessages[draftMessageId.current].attachmentsToSend;
    if (attachments && size(attachments) > 0) {
      removeAllAttachmentsToSend({
        draftId: draftMessageId.current,
        ids: attachments?.map(({ attachment}) => attachment.id),
      });
    }

    setRemovedAttachments(
      () =>
        editingMessage?.attachments?.map(({ id, type }: IAttachmentBase) => ({ id, type })) || [],
    );
  }, [
    setRemovedAttachments,
    editingMessage,
    removeAllAttachmentsToSend,
    selectedChat?.draftMessages[draftMessageId.current]?.attachmentsToSend,
  ]);

  const handleRegisterAudioBtnClick = useCallback(() => {
    if (!isRecording) {
      setRequestMicrophoneLoading(true);
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setRecordAudioStream(stream);
          setRequestMicrophoneLoading(false);
          setIsRecording(true);
        })
        .catch(() => {
          setRequestMicrophoneLoading(false);
        });
    }

    setIsRecording(false);
  }, [isRecording]);

  const openSelectFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const uploadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        for (let index = 0; index < event.target.files.length; index += 1) {
          const file = event.target.files.item(index) as File;

          const fileType = getAttachmentType(file.name);

          uploadAttachmentRequest({
            draftId: draftMessageId.current,
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

  const onPasteText = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const pastedText = event.clipboardData.getData('text');
      const allowedTextLength = INPUT_MAX_LENGTH - event.currentTarget.innerText.length;

      if (pastedText) {
        insertTextAndUpdateCursor(pastedText.substring(0, allowedTextLength));
      }
    },
    [insertTextAndUpdateCursor],
  );

  const onPasteFiles = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      for (let index = 0; index < event.clipboardData.files.length; index += 1) {
        const file = event.clipboardData.files.item(index) as File;

        // extension test
        const fileType = getAttachmentType(file.name);

        uploadAttachmentRequest({
          draftId: draftMessageId.current,
          type: fileType,
          file,
          attachmentId: Number(`${new Date().getTime()}${index}`),
        });
      }
    },
    [uploadAttachmentRequest],
  );

  const onPaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (event.clipboardData.files.length) {
        onPasteFiles(event);
      } else {
        onPasteText(event);
      }
    },
    [onPasteFiles, onPasteText],
  );

  console.log('SELECTED CHAT', selectedChat);

  return (
    <div className="message-input">
      {selectedChat && (
        <>
          {replyingMessage && <RespondingMessage />}
          {editingMessage && <EditingMessage />}
          {((editingMessageAttachments && editingMessageAttachments?.length > 0) ||
            (selectedChat?.draftMessages[draftMessageId.current]?.attachmentsToSend &&
              size(selectedChat?.draftMessages[draftMessageId.current]?.attachmentsToSend))) && (
            <div className="message-input__attachments-box">
              <div className="message-input__attachments-box__container">
                {editingMessageAttachments?.map((attachment: IAttachmentBase) => (
                  <MessageInputAttachment
                    attachment={{ attachment } as IAttachmentToSend<IAttachmentBase>}
                    isFromEdit
                    removeSelectedAttachment={removeAttachment}
                    key={attachment.id}
                  />
                ))}
                {selectedChat?.draftMessages[draftMessageId.current].attachmentsToSend?.map(
                  (attachment) => (
                    <MessageInputAttachment
                      attachment={attachment}
                      key={attachment.attachment.id}
                    />
                  ),
                )}
              </div>
              <button
                onClick={removeAllAttachments}
                type="button"
                className="message-input__attachments-box__delete-all">
                <CloseSvg />
              </button>
            </div>
          )}
          {false && <MessageError />}
          <div className="message-input__send-message">
            {isRecording ? (
              <RecordingMessage
                referredMessage={refferedReplyingMessage.current}
                hide={handleRegisterAudioBtnClick}
              />
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
                  onKeyDown={onKeyDown}
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

                  <Button
                    type="button"
                    onClick={handleRegisterAudioBtnClick}
                    loading={requestMicrophoneLoading}
                    className="message-input__voice-btn">
                    <VoiceSvg />
                  </Button>

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
