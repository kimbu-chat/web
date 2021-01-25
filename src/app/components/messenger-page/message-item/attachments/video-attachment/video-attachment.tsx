import React, { useCallback, useState } from 'react';
import './video-attachment.scss';

import PlaySvg from 'icons/ic-play.svg';
import moment from 'moment';
import { FadeAnimationWrapper, VideoPlayerModal } from 'components';
import { IVideoAttachment } from 'store/chats/models';

interface IMessageVideoAttachmentProps {
  attachment: IVideoAttachment;
}

export const MessageVideoAttachment: React.FC<IMessageVideoAttachmentProps> = React.memo(({ attachment }) => {
  const [videoPlayerDisplayed, setVideoPlayerDisplayed] = useState(false);
  const changeVideoPlayerDisplayed = useCallback(() => setVideoPlayerDisplayed((oldState) => !oldState), [setVideoPlayerDisplayed]);

  return (
    <>
      <div onClick={changeVideoPlayerDisplayed} className='video-attachment'>
        <img src={attachment.firstFrameUrl} alt='' className='video-attachment__img' />
        <div className='video-attachment__blur' />
        <PlaySvg className='video-attachment__svg' viewBox='0 0 25 25' />
        <div className='video-attachment__duration'>{moment.utc(attachment.duration * 1000).format('mm:ss')}</div>
      </div>
      <FadeAnimationWrapper isDisplayed={videoPlayerDisplayed}>
        <VideoPlayerModal url={attachment.url} onClose={changeVideoPlayerDisplayed} />
      </FadeAnimationWrapper>
    </>
  );
});
