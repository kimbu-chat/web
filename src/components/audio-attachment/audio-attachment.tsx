import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';

import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { changeMusic } from '@utils/current-music';
import { IAudioAttachment } from '@store/chats/models';

import './audio-attachment.scss';

export const MessageAudioAttachment: React.FC<IAudioAttachment> = ({ ...attachment }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<AudioPlayer | null>(null);

  const playPauseAudio = useCallback(() => {
    changeMusic(audioRef.current?.audio.current || null, setIsPlaying, true);
  }, [setIsPlaying, audioRef]);

  // const onEnded = useCallback(() => setIsPlaying(false), [setIsPlaying]);

  useEffect(
    () => () => {
      changeMusic(null);
    },
    [setIsPlaying],
  );

  return (
    <div className="audio-attachment">
      <button type="button" onClick={playPauseAudio} className="audio-attachment__download">
        {isPlaying ? <PauseSvg viewBox="0 0 24 24" /> : <PlaySvg viewBox="0 0 24 24" />}
      </button>
      <div className="audio-attachment__play-data">
        <div className="audio-attachment__data">
          <h4 className="audio-attachment__file-name">{attachment.fileName}</h4>
          <div className="audio-attachment__duration">
            {dayjs.utc(attachment.duration * 1000).format('mm:ss')}
          </div>
        </div>

        <AudioPlayer
          ref={audioRef as React.RefObject<AudioPlayer>}
          src={attachment.url}
          preload="metadata"
          defaultCurrentTime={<span>{dayjs.utc(attachment.duration * 1000).format('mm:ss')}</span>}
          showSkipControls={false}
          showJumpControls={false}
          autoPlayAfterSrcChange={false}
          customProgressBarSection={[RHAP_UI.PROGRESS_BAR]}
          customControlsSection={[]}
          customAdditionalControls={[]}
        />
      </div>
    </div>
  );
};
