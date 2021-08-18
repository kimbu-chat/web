import React from 'react';

import { IVideoAttachment } from 'kimbu-models';

import { MediaModal } from '@components/image-modal';
import { useToggledState } from '@hooks/use-toggled-state';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { IGroupable } from '@store/chats/models';
import { SECOND_DURATION } from '@utils/constants';
import { getMinutesSeconds } from '@utils/date-utils';

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
        <span className="chat-video__duration">{getMinutesSeconds(video.duration)}</span>
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
