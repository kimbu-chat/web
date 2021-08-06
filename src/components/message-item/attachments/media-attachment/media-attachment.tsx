import React from 'react';

import { AttachmentType, IPictureAttachment, IVideoAttachment } from 'kimbu-models';

import { MediaModal } from '@components/image-modal';
import ProgressiveImage from '@components/progressive-image';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { INamedAttachment } from '@store/chats/models/named-attachment';
import { getMinutesSeconds } from '@utils/date-utils';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './media-attachment.scss';

interface IMessageMediaAttachmentProps {
  attachmentId: number;
  attachmentsArr: INamedAttachment[];
  observeIntersection: ObserveFn;
}

export const MessageMediaAttachment: React.FC<IMessageMediaAttachmentProps> = ({
  attachmentId,
  attachmentsArr,
  observeIntersection,
}) => {
  const [bigMediaDisplayed, displayBigMedia, hideBigMedia] = useToggledState(false);

  const currentAttachment = attachmentsArr.find(({ id }) => id === attachmentId);

  return (
    <>
      <div onClick={displayBigMedia} className="media-attachment">
        {(currentAttachment?.type === AttachmentType.Picture ||
          currentAttachment?.fileName?.endsWith('.gif')) && (
          <ProgressiveImage
            thumb={(currentAttachment as IPictureAttachment).previewUrl}
            src={currentAttachment.url}
            alt={currentAttachment.fileName}
            width={280}
            height={210}
            observeIntersection={observeIntersection}
          />
          // <img
          //   src={(currentAttachment as IPictureAttachment).url}
          //   alt=""
          //   className="media-attachment__img"
          // />
        )}

        {currentAttachment?.type === AttachmentType.Video && (
          <>
            <img
              src={(currentAttachment as IVideoAttachment).firstFrameUrl}
              alt=""
              className="media-attachment__img"
            />
            <div className="media-attachment__blur" />
            <PlaySvg className="media-attachment__svg" viewBox="0 0 25 25" />
            <div className="media-attachment__duration">
              {getMinutesSeconds((currentAttachment as IVideoAttachment).duration)}
            </div>{' '}
          </>
        )}
      </div>
      {bigMediaDisplayed && (
        <MediaModal
          attachmentsArr={attachmentsArr}
          attachmentId={attachmentId}
          onClose={hideBigMedia}
        />
      )}
    </>
  );
};
