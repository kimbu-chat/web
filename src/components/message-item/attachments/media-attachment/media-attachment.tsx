import React, { useEffect, useMemo } from 'react';

import { AttachmentType, IVideoAttachment } from 'kimbu-models';

import { MediaModal } from '@components/image-modal';
import ProgressiveImage from '@components/progressive-image';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { IAttachmentToSend } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';
import { getMinutesSeconds } from '@utils/date-utils';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './media-attachment.scss';

interface IMediaAttachmentProps {
  attachmentId: number;
  attachmentsArr: (INamedAttachment | IAttachmentToSend)[];
  observeIntersection: ObserveFn;
}

export const MediaAttachment: React.FC<IMediaAttachmentProps> = ({ attachmentId, attachmentsArr, observeIntersection }) => {
  const [bigMediaDisplayed, displayBigMedia, hideBigMedia] = useToggledState(false);

  const currentAttachment = attachmentsArr.find(({ id }) => id === attachmentId);

  const [fileProgress, previewUrl] = useMemo(() => {
    if (currentAttachment && 'file' in currentAttachment) {
      return [currentAttachment.progress, URL.createObjectURL(currentAttachment.file)];
    }

    return [undefined, undefined];
  }, [currentAttachment]);

  const [fileName, fileUrl] = useMemo(() => {
    if (currentAttachment && 'fileName' in currentAttachment) {
      return [currentAttachment.fileName, currentAttachment.url];
    }

    return [undefined, undefined];
  }, [currentAttachment]);

  useEffect(() => {
    if (previewUrl && fileUrl) URL.revokeObjectURL(previewUrl);
  }, [fileUrl, previewUrl]);

  return (
    <>
      <div onClick={displayBigMedia} className="media-attachment">
        {(currentAttachment?.type === AttachmentType.Picture || fileName?.endsWith('.gif')) && (
          <ProgressiveImage
            thumb={previewUrl}
            src={fileUrl}
            alt={fileName || ''}
            width={280}
            height={210}
            progress={fileProgress}
            byteSize={currentAttachment?.byteSize}
            fileName={(currentAttachment as INamedAttachment).fileName}
            uploadedBytes={(currentAttachment as IAttachmentToSend).uploadedBytes}
            observeIntersection={observeIntersection}
          />
        )}

        {currentAttachment?.type === AttachmentType.Video && (
          <>
            <img src={(currentAttachment as IVideoAttachment).firstFrameUrl} alt="" className="media-attachment__img" />
            <div className="media-attachment__blur" />
            <PlaySvg className="media-attachment__svg" />
            <div className="media-attachment__duration">{getMinutesSeconds((currentAttachment as IVideoAttachment).duration)}</div>{' '}
          </>
        )}
      </div>
      {bigMediaDisplayed && currentAttachment && 'url' in currentAttachment && (
        <MediaModal attachmentsArr={attachmentsArr as INamedAttachment[]} attachmentId={attachmentId} onClose={hideBigMedia} />
      )}
    </>
  );
};
