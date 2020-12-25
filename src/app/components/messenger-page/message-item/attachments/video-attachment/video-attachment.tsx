import React, { useCallback, useState } from 'react';
import './video-attachment.scss';

import PlaySvg from 'icons/ic-play.svg';
import moment from 'moment';
import { FadeAnimationWrapper } from 'components';
import { VideoAttachment } from 'store/chats/models';
import { VideoPlayer } from '../../../shared/video-player/video-player';

namespace MessageVideoAttachmentNS {
  export interface Props {
    attachment: VideoAttachment;
  }
}

export const MessageVideoAttachment = React.memo(({ attachment }: MessageVideoAttachmentNS.Props) => {
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
        <VideoPlayer url={attachment.url} onClose={changeVideoPlayerDisplayed} />
      </FadeAnimationWrapper>
    </>
  );
});
