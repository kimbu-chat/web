import { useState, useCallback, useEffect } from 'react';

import { size } from 'lodash';
import { useSelector } from 'react-redux';

import { authenticatedSelector } from '@store/auth/selectors';
import { uploadAttachmentRequestAction } from '@store/chats/actions';
import { getSelectedChatIdSelector } from '@store/chats/selectors';
import { containsFiles } from '@utils/contains-files';
import { getAttachmentType } from '@utils/get-file-extension';

import { useActionWithDispatch } from './use-action-with-dispatch';

interface IDragDropHookParams {
  chatId: number;
}

export const useDragDrop = ({ chatId }: IDragDropHookParams) => {
  const uploadAttachmentRequest = useActionWithDispatch(uploadAttachmentRequestAction);

  const isAuthenticated = useSelector(authenticatedSelector);
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (containsFiles(e) && selectedChatId) {
        setIsDragging(true);
      }
    },
    [selectedChatId],
  );

  const onDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (containsFiles(e) && selectedChatId) {
        setIsDragging(true);
      }
    },
    [selectedChatId],
  );

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { relatedTarget: toTarget } = e;

    if (!toTarget) {
      setIsDragging(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      setIsDragging(false);
      e.preventDefault();
      e.stopPropagation();

      if (
        (e.target as HTMLDivElement).matches(
          '.drag-indicator, .drag-indicator *, .chat-page, .chat-page *',
        )
      ) {
        if (size(e.dataTransfer?.files) > 0) {
          for (let index = 0; index < (e.dataTransfer?.files.length || 0); index += 1) {
            const file = e.dataTransfer?.files[index] as File;

            const fileType = getAttachmentType(file.name);

            uploadAttachmentRequest({
              chatId,
              type: fileType,
              file,
              attachmentId: Number(`${new Date().getTime()}${index}`),
            });
          }
        }
      }
    },
    [chatId, uploadAttachmentRequest],
  );

  useEffect(() => {
    if (isAuthenticated) {
      document.addEventListener('drop', onDrop);
      document.addEventListener('dragleave', onDragLeave);
      document.addEventListener('dragenter', onDragEnter);
      document.addEventListener('dragover', onDragOver);
    }

    return () => {
      document.removeEventListener('drop', onDrop);
      document.removeEventListener('dragleave', onDragLeave);
      document.removeEventListener('dragenter', onDragEnter);
      document.removeEventListener('dragover', onDragOver);
    };
  }, [isAuthenticated, onDragEnter, onDragLeave, onDragOver, onDrop]);

  return { isDragging };
};
