import React, { useCallback, useState } from 'react';
import dayjs from 'dayjs';

import { FadeAnimationWrapper, MediaModal } from '@components';
import { FileType, IPictureAttachment, IVideoAttachment } from '@store/chats/models';
import { ReactComponent as PlaySvg } from '@icons/play.svg';

import './media-attachment.scss';

interface IMessageMediaAttachmentProps {
  attachmentId: number;
  attachmentsArr: (IPictureAttachment | IVideoAttachment)[];
}

export const MessageMediaAttachment: React.FC<IMessageMediaAttachmentProps> = ({
  attachmentId,
  attachmentsArr,
}) => {
  const [bigMediaDisplayed, setBigMediaDisplayed] = useState(false);
  const changeBigMediaDisplayed = useCallback(() => setBigMediaDisplayed((oldState) => !oldState), [
    setBigMediaDisplayed,
  ]);

  const currentAttachment = attachmentsArr.find(({ id }) => id === attachmentId);

  return (
    <>
      <div onClick={changeBigMediaDisplayed} className="media-attachment">
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
              {dayjs.utc((currentAttachment as IVideoAttachment).duration * 1000).format('mm:ss')}
            </div>{' '}
          </>
        )}
      </div>
      <FadeAnimationWrapper isDisplayed={bigMediaDisplayed}>
        <MediaModal
          attachmentsArr={attachmentsArr}
          attachmentId={attachmentId}
          onClose={changeBigMediaDisplayed}
        />
      </FadeAnimationWrapper>
    </>
  );
};
