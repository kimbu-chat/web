import React, { useRef } from 'react';
import './recording-attachment.scss';

import { ReactComponent as PlaySvg } from '@icons/ic-play.svg';
import { ReactComponent as PauseSvg } from '@icons/ic-pause.svg';

import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import moment from 'moment';
import { changeMusic } from '@utils/current-music';
import { IVoiceAttachment } from '@store/chats/models';

interface IRecordingAttachmentProps {
  attachment: IVoiceAttachment;
}

export const RecordingAttachment: React.FC<IRecordingAttachmentProps> = React.memo(
  ({ attachment }) => {
    const audioRef = useRef<AudioPlayer>();
    return (
      <div className="recording-attachment">
        <AudioPlayer
          ref={audioRef as React.RefObject<AudioPlayer>}
          onPlay={() =>
            audioRef.current?.audio.current && changeMusic(audioRef.current?.audio.current)
          }
          src={attachment.url}
          preload="none"
          defaultCurrentTime={<span>{moment.utc(attachment.duration * 1000).format('mm:ss')}</span>}
          showSkipControls={false}
          showJumpControls={false}
          autoPlayAfterSrcChange={false}
          layout="horizontal-reverse"
          customProgressBarSection={[RHAP_UI.PROGRESS_BAR, RHAP_UI.CURRENT_TIME]}
          customControlsSection={[RHAP_UI.MAIN_CONTROLS]}
          customAdditionalControls={[]}
          customIcons={{
            play: (
              <div className="recording-attachment__btn">
                <PlaySvg viewBox="0 0 25 25" />
              </div>
            ),
            pause: (
              <div className="recording-attachment__btn">
                <PauseSvg viewBox="0 0 25 25" />
              </div>
            ),
          }}
        />
      </div>
    );
  },
);
