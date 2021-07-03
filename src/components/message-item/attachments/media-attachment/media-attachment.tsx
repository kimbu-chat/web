import React from 'react';

import { MediaModal } from '@components/image-modal';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { FileType, IPictureAttachment, IVideoAttachment } from '@store/chats/models';
import { getMinutesSeconds } from '@utils/date-utils';

import './media-attachment.scss';

interface IMessageMediaAttachmentProps {
  attachmentId: number;
  attachmentsArr: (IPictureAttachment | IVideoAttachment)[];
}

export const MessageMediaAttachment: React.FC<IMessageMediaAttachmentProps> = ({
  attachmentId,
  attachmentsArr,
}) => {
  const [bigMediaDisplayed, displayBigMedia, hideBigMedia] = useToggledState(false);

  const currentAttachment = attachmentsArr.find(({ id }) => id === attachmentId);

  return (
    <>
      <div onClick={displayBigMedia} className="media-attachment">
        {currentAttachment?.type === FileType.Picture && (
          <img
            src={(currentAttachment as IPictureAttachment).previewUrl}
            alt=""
            className="media-attachment__img"
          />
        )}

        {currentAttachment?.type === FileType.Video && (
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
