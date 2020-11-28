import React, { useRef } from 'react';
import moment from 'moment';
import PlaySvg from 'icons/ic-play.svg';
import PauseSvg from 'icons/ic-pause.svg';

import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import { changeMusic } from 'utils/functions/current-music';

namespace ChatRecordingNS {
  export interface Props {
    recording: {
      url: string;
      duration: number;
    };
  }
}

export const ChatRecording: React.FC<ChatRecordingNS.Props> = React.memo(({ recording }) => {
  const audioRef = useRef<AudioPlayer>();
  return (
    <AudioPlayer
      ref={audioRef as React.RefObject<AudioPlayer>}
      onPlay={() => changeMusic(audioRef.current?.audio.current!)}
      src={recording.url}
      preload='none'
      defaultCurrentTime={<span>{moment.utc(recording.duration * 1000).format('mm:ss')}</span>}
      showSkipControls={false}
      showJumpControls={false}
      autoPlayAfterSrcChange={false}
      layout='horizontal-reverse'
      customProgressBarSection={[RHAP_UI.PROGRESS_BAR, RHAP_UI.CURRENT_TIME]}
      customControlsSection={[RHAP_UI.MAIN_CONTROLS]}
      customAdditionalControls={[]}
      customIcons={{
        play: (
          <div className='recording-attachment__btn'>
            <PlaySvg viewBox='0 0 25 25' />
          </div>
        ),
        pause: (
          <div className='recording-attachment__btn'>
            <PauseSvg viewBox='0 0 25 25' />
          </div>
        ),
      }}
    />
  );
});
