import React, { useCallback, useState } from 'react';

import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { MediaModal } from '@components/image-modal';
import FadeAnimationWrapper from '@components/fade-animation-wrapper';
import { IGroupable, IVideoAttachment } from '@store/chats/models';
import { getMinutesSeconds } from '@utils/date-utils';

interface IVideoFromListProps {
  video: IVideoAttachment & IGroupable;
  attachmentsArr: IVideoAttachment[];
}

const VideoFromList: React.FC<IVideoFromListProps> = ({ video, attachmentsArr }) => {
  const [videoPlayerDisplayed, setVideoPlayerDisplayed] = useState(false);
  const changeVideoPlayerDisplayed = useCallback(
    () => setVideoPlayerDisplayed((oldState) => !oldState),
    [setVideoPlayerDisplayed],
  );

  return (
    <>
      <div onClick={changeVideoPlayerDisplayed} className="chat-video__video-wrapper">
        <img alt="" className="chat-video__video" src={video.firstFrameUrl} />
        <div className="chat-video__blur" />
        <span className="chat-video__duration">{getMinutesSeconds(video.duration * 1000)}</span>
        <button type="button" className="chat-video__play">
          <PlaySvg />
        </button>
      </div>

      <FadeAnimationWrapper isDisplayed={videoPlayerDisplayed}>
        <MediaModal
          attachmentId={video.id}
          attachmentsArr={attachmentsArr}
          onClose={changeVideoPlayerDisplayed}
        />
      </FadeAnimationWrapper>
    </>
  );
};

VideoFromList.displayName = 'VideoFromList';

export { VideoFromList };
