import React, { useCallback, useState } from 'react';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import moment from 'moment';
import { FadeAnimationWrapper } from '@components/shared';
import { MediaModal } from '@components/messenger-page';
import { IGroupable, IVideoAttachment } from '@store/chats/models';
import { doesYearDifferFromCurrent } from '@utils/set-separators';
import { xorBy } from 'lodash';

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
    <React.Fragment key={video.id}>
      {video.needToShowMonthSeparator && (
        <div className="chat-video__separator">
          {video.needToShowMonthSeparator &&
            (video.needToShowYearSeparator || doesYearDifferFromCurrent(video.creationDateTime)
              ? moment(video.creationDateTime).format('MMMM YYYY')
              : moment(video.creationDateTime).format('MMMM'))}
        </div>
      )}
      <div onClick={changeVideoPlayerDisplayed} className="chat-video__video-wrapper">
        <img alt="" className="chat-video__video" src={video.firstFrameUrl} />
        <div className="chat-video__blur" />
        <span className="chat-video__duration">
          {moment.utc(video.duration * 1000).format('mm:ss')}
        </span>
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
    </React.Fragment>
  );
};

VideoFromList.displayName = 'VideoFromList';

export { VideoFromList };
