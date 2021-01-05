import React, { useCallback, useState } from 'react';
import PlaySvg from 'icons/ic-play.svg';
import moment from 'moment';
import { FadeAnimationWrapper, VideoPlayer } from 'components';
import { IGroupable, IVideoAttachment } from 'store/chats/models';
import { doesYearDifferFromCurrent } from 'app/utils/set-separators';

interface IVideoFromListProps {
  video: IVideoAttachment & IGroupable;
}

export const VideoFromList: React.FC<IVideoFromListProps> = React.memo(({ video }) => {
  const [videoPlayerDisplayed, setVideoPlayerDisplayed] = useState(false);
  const changeVideoPlayerDisplayed = useCallback(() => setVideoPlayerDisplayed((oldState) => !oldState), [setVideoPlayerDisplayed]);

  return (
    <React.Fragment key={video.id}>
      {video.needToShowMonthSeparator && (
        <div className='chat-video__separator'>
          {video.needToShowMonthSeparator &&
            (video.needToShowYearSeparator || doesYearDifferFromCurrent(video.creationDateTime)
              ? moment(video.creationDateTime).format('MMMM YYYY')
              : moment(video.creationDateTime).format('MMMM'))}
        </div>
      )}
      <div onClick={changeVideoPlayerDisplayed} className='chat-video__video-wrapper'>
        <img alt='' className='chat-video__video' src={video.firstFrameUrl} />
        <button type='button' className='chat-video__play'>
          <PlaySvg viewBox='0 0 25 25' />
          <span className='chat-video__duration'>{moment.utc(video.duration * 1000).format('mm:ss')}</span>
        </button>
      </div>

      <FadeAnimationWrapper isDisplayed={videoPlayerDisplayed}>
        <VideoPlayer url={video.url} onClose={changeVideoPlayerDisplayed} />
      </FadeAnimationWrapper>
    </React.Fragment>
  );
});
