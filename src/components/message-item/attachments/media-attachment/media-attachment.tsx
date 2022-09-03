import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AttachmentType, IVideoAttachment } from 'kimbu-models';

import { CirclePreloaderSize, CircleProgressPreloader } from '@components/circle-progress-preloader/circle-progress-preloader';
import { MediaModal } from '@components/image-modal';
import ProgressiveImage from '@components/progressive-image';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { removeAttachmentAction } from '@store/chats/actions';
import { IAttachmentToSend } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';
import { getMinutesSeconds } from '@utils/date-utils';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './media-attachment.scss';

const BLOCK_NAME = 'media-attachment';

interface IMediaAttachmentProps {
  attachmentId: number;
  attachmentsArr: (INamedAttachment | IAttachmentToSend)[];
  messageId?: number;
  observeIntersection: ObserveFn;
}

export const MediaAttachment: React.FC<IMediaAttachmentProps> = ({ messageId, attachmentId, attachmentsArr, observeIntersection }) => {
  const [bigMediaDisplayed, displayBigMedia, hideBigMedia] = useToggledState(false);
  const [isHover, setIsHover] = useState(false);

  const removeAttachment = useActionWithDispatch(removeAttachmentAction);

  const currentAttachment = useMemo<INamedAttachment | IAttachmentToSend | undefined>(
    () => attachmentsArr.find(({ id }) => id === attachmentId),
    [attachmentId, attachmentsArr],
  );

  const [fileProgress, previewUrl, success, uploadedBytes] = useMemo(() => {
    if (currentAttachment && 'file' in currentAttachment) {
      return [currentAttachment.progress, URL.createObjectURL(currentAttachment.file), currentAttachment.success, currentAttachment.uploadedBytes];
    }

    return [undefined, undefined, undefined, undefined];
  }, [currentAttachment]);

  const [fileName, fileUrl] = useMemo(() => {
    if (currentAttachment && 'fileName' in currentAttachment) {
      return [currentAttachment.fileName, currentAttachment.url];
    }

    return [undefined, undefined];
  }, [currentAttachment]);

  const cancelUploading = useCallback(() => {
    if (messageId && currentAttachment) {
      removeAttachment({ attachmentId: currentAttachment.id, messageId });
    }
  }, [currentAttachment, messageId, removeAttachment]);

  const onMediaClickHandler = useMemo(() => (success === true || success === undefined ? displayBigMedia : undefined), [displayBigMedia, success]);

  useEffect(() => {
    if (previewUrl && fileUrl) URL.revokeObjectURL(previewUrl);
  }, [fileUrl, previewUrl]);

  return (
    <>
      <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={onMediaClickHandler} className={BLOCK_NAME}>
        {currentAttachment && uploadedBytes !== undefined && success === false && (
          <div onClick={cancelUploading} className={`${BLOCK_NAME}__cancel-btn`} style={{ opacity: `${isHover ? 1 : 0}` }}>
            <CircleProgressPreloader byteSize={currentAttachment?.byteSize} uploadedBytes={uploadedBytes} withCross size={CirclePreloaderSize.BIG} />
          </div>
        )}

        {(currentAttachment?.type === AttachmentType.Picture || fileName?.endsWith('.gif')) && (
          <ProgressiveImage
            thumb={previewUrl}
            src={fileUrl}
            alt={fileName || ''}
            width={280}
            height={210}
            progress={isHover ? 0 : fileProgress}
            byteSize={isHover ? undefined : currentAttachment?.byteSize}
            fileName={isHover ? undefined : (currentAttachment as INamedAttachment).fileName}
            uploadedBytes={isHover ? undefined : (currentAttachment as IAttachmentToSend).uploadedBytes}
            observeIntersection={observeIntersection}
          />
        )}

        {currentAttachment?.type === AttachmentType.Video && (
          <>
            <img src={(currentAttachment as IVideoAttachment).firstFrameUrl} alt="" className={`${BLOCK_NAME}__img`} />
            <div className={`${BLOCK_NAME}__blur`} />
            <PlaySvg className={`${BLOCK_NAME}__svg`} />
            <div className={`${BLOCK_NAME}__duration`}>{getMinutesSeconds((currentAttachment as IVideoAttachment).duration)}</div>{' '}
          </>
        )}
      </div>
      {bigMediaDisplayed && currentAttachment && 'url' in currentAttachment && (
        <MediaModal attachmentsArr={attachmentsArr as INamedAttachment[]} attachmentId={attachmentId} onClose={hideBigMedia} />
      )}
    </>
  );
};
