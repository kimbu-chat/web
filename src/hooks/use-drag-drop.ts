import { useState, useCallback } from 'react';

import { containsFiles } from '@utils/contains-files';
import { uploadAttachmentRequestAction } from '@store/chats/actions';
import { getFileType } from '@utils/get-file-extension';

import { useActionWithDispatch } from './use-action-with-dispatch';

export const useDragDrop = () => {
  const uploadAttachmentRequest = useActionWithDispatch(uploadAttachmentRequestAction);

  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (containsFiles(e)) {
      setIsDragging(true);
    }
  }, []);

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (containsFiles(e)) {
      setIsDragging(true);
    }
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { relatedTarget: toTarget } = e;

    if (!toTarget) {
      setIsDragging(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      setIsDragging(false);
      e.preventDefault();
      e.stopPropagation();

      if (
        (e.target as HTMLDivElement).matches(
          '.drag-indicator, .drag-indicator *, .chat-page, .chat-page *, .chat-data__chat-data, .chat-data__chat-data *, .chat-info__messenger-info, .chat-info__messenger-info *',
        )
      ) {
        if ((e.dataTransfer?.files?.length || 0) > 0) {
          for (let index = 0; index < (e.dataTransfer?.files.length || 0); index += 1) {
            const file = e.dataTransfer?.files[index] as File;

            const fileType = getFileType(file.name);

            uploadAttachmentRequest({
              type: fileType,
              file,
              attachmentId: Number(`${new Date().getTime()}${index}`),
            });
          }
        }
      }
    },
    [setIsDragging, uploadAttachmentRequest],
  );

  return { onDrop, onDragLeave, onDragEnter, onDragOver, isDragging };
};
