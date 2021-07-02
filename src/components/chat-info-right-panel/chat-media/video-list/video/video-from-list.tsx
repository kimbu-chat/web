import React from 'react';

import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { MediaModal } from '@components/image-modal';
import { IGroupable, IVideoAttachment } from '@store/chats/models';
import { getMinutesSeconds } from '@utils/date-utils';
import { useToggledState } from '@hooks/use-toggled-state';

interface IVideoFromListProps {
  video: IVideoAttachment & IGroupable;
  attachmentsArr: IVideoAttachment[];
}

const VideoFromList: React.FC<IVideoFromListProps> = ({ video, attachmentsArr }) => {
  const [videoPlayerDisplayed, displayVideoPlayer, hideVideoPlayer] = useToggledState(false);

  return (
    <>
      <div onClick={displayVideoPlayer} className="chat-video__video-wrapper">
        <img alt="" className="chat-video__video" src={video.firstFrameUrl} />
        <div className="chat-video__blur" />
        <span className="chat-video__duration">{getMinutesSeconds(video.duration * 1000)}</span>
        <button type="button" className="chat-video__play">
          <PlaySvg />
        </button>
      </div>

      {videoPlayerDisplayed && (
        <MediaModal
          attachmentId={video.id}
          attachmentsArr={attachmentsArr}
          onClose={hideVideoPlayer}
        />
      )}
    </>
  );
};

VideoFromList.displayName = 'VideoFromList';

export { VideoFromList };
