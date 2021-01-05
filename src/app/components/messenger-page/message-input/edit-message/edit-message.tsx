import { getMessageToEditSelector, getSelectedChatAttachmentsToSendSelector } from 'store/chats/selectors';
import { getTypingStrategySelector } from 'store/settings/selectors';
import { getFileType } from 'app/utils/get-file-extension';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import Mousetrap from 'mousetrap';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AddSvg from 'icons/ic-add-new.svg';
import './edit-message.scss';
import { LocalizationContext } from 'app/app';
import { IAttachmentCreation, IAttachmentToSend, IBaseAttachment } from 'store/chats/models';
import { useGlobalDrop } from 'app/hooks/use-global-drop';
import { useReferState } from 'app/hooks/use-referred-state';
import { SubmitEditMessage } from 'app/store/chats/features/edit-message/submit-edit-message';
import { UploadAttachmentRequest } from 'app/store/chats/features/upload-attachment/upload-attachment-request';
import { TypingStrategy } from 'app/store/settings/features/models';
import { MessageInputAttachment } from '../message-input-attachment/message-input-attachment';
import { ExpandingTextarea } from '../expanding-textarea/expanding-textarea';

export const EditMessage = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const uploadAttachmentRequest = useActionWithDispatch(UploadAttachmentRequest.action);
  const submitEditMessage = useActionWithDispatch(SubmitEditMessage.action);

  const messageToEdit = useSelector(getMessageToEditSelector);
  const selectedChatAttachmentsToSend = useSelector(getSelectedChatAttachmentsToSendSelector);
  const myTypingStrategy = useSelector(getTypingStrategySelector);

  const [newText, setNewText] = useState(messageToEdit?.text || '');
  const referredNewText = useReferState(newText);
  const [removedAttachments, setRemovedAttachments] = useState<IAttachmentCreation[]>([]);
  const referredRemovedAttachments = useReferState(removedAttachments);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const updatedSelectedChatAttachmentsToSend = useRef<IAttachmentToSend<IBaseAttachment>[] | undefined>();

  useEffect(() => {
    updatedSelectedChatAttachmentsToSend.current = selectedChatAttachmentsToSend;
  }, [selectedChatAttachmentsToSend]);

  const removeAttachment = useCallback(
    (attachmentToRemove: IAttachmentCreation) => {
      setRemovedAttachments((oldList) => [...oldList, attachmentToRemove]);
    },
    [setRemovedAttachments],
  );

  const onType = useCallback(
    (event) => {
      setNewText(event.target.value);
    },
    [setNewText],
  );

  const onPaste = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (event.clipboardData?.files.length! > 0) {
        for (let index = 0; index < event.clipboardData?.files.length!; ++index) {
          const file = event.clipboardData?.files!.item(index) as File;

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

  const uploadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length! > 0) {
        for (let index = 0; index < event.target.files!.length; ++index) {
          const file = event.target.files!.item(index) as File;

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

  const submitEditedMessage = useCallback(() => {
    const newAttachments = updatedSelectedChatAttachmentsToSend?.current?.map(({ attachment }) => attachment);

    submitEditMessage({
      text: referredNewText.current,
      removedAttachments: referredRemovedAttachments.current,
      newAttachments,
    });
  }, [referredNewText, referredRemovedAttachments]);

  const openSelectFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleFocus = useCallback(() => {
    if (myTypingStrategy === TypingStrategy.Nle) {
      Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], () => {
        submitEditedMessage();
      });
      Mousetrap.bind('enter', (e) => {
        onType(e);
      });
    } else {
      Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], (e) => {
        setNewText((oldText) => `${oldText}\n`);
        onType(e);
      });
      Mousetrap.bind('enter', (e) => {
        e.preventDefault();
        submitEditedMessage();
      });
    }
  }, [setNewText, onType, submitEditedMessage, myTypingStrategy]);

  const handleBlur = useCallback(() => {
    Mousetrap.unbind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter']);
    Mousetrap.unbind('enter');
  }, []);

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
            type: fileType,
            file,
            attachmentId: Number(`${new Date().getTime()}${index}`),
          });
        }
      }
    },
    [setIsDraggingOver, uploadAttachmentRequest],
  );

  return (
    <div onDrop={onDrop} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
      {messageToEdit?.attachments
        ?.filter(({ id }) => removedAttachments.findIndex((removedAttachment) => removedAttachment.id === id) === -1)
        .map((attachment) => (
          <MessageInputAttachment
            attachment={{ attachment } as IAttachmentToSend<IBaseAttachment>}
            isFromEdit
            removeSelectedAttachment={removeAttachment}
            key={attachment.id}
          />
        ))}
      {selectedChatAttachmentsToSend?.map((attachment) => (
        <MessageInputAttachment attachment={attachment} key={attachment.attachment.id} />
      ))}

      {(isDragging || isDraggingOver) && (
        <div className={`message-input__drag ${isDraggingOver ? 'message-input__drag--active' : ''}`}>Drop files here to send them</div>
      )}

      {!(isDragging || isDraggingOver) && (
        <div className='message-input__send-message'>
          <input multiple className='hidden' type='file' onChange={uploadFile} ref={fileInputRef} />
          <button type='button' onClick={openSelectFiles} className='message-input__add'>
            <AddSvg />
          </button>

          <div className='message-input__input-group'>
            <ExpandingTextarea
              placeholder={t('messageInput.write')}
              value={newText}
              onChange={onType}
              className='mousetrap  message-input__input-message'
              onFocus={handleFocus}
              onBlur={handleBlur}
              onPaste={onPaste}
            />
          </div>
          <button type='button' onClick={submitEditedMessage} className='message-input__edit-confirm'>
            Save
          </button>
        </div>
      )}
    </div>
  );
});
