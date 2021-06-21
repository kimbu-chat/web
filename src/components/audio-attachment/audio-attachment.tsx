import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';

import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { changeMusic } from '@utils/current-music';
import { IAudioAttachment } from '@store/chats/models';

import './audio-attachment.scss';

const BLOCK_NAME = 'audio-attachment';

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
    <div className={BLOCK_NAME}>
      <button type="button" onClick={playPauseAudio} className={`${BLOCK_NAME}__download`}>
        {isPlaying ? <PauseSvg viewBox="0 0 24 24" /> : <PlaySvg viewBox="0 0 24 24" />}
      </button>
      <div className={`${BLOCK_NAME}__play-data`}>
        <div className={`${BLOCK_NAME}__data`}>
          <h4 className={`${BLOCK_NAME}__file-name`}>{attachment.fileName}</h4>
          <div className={`${BLOCK_NAME}__duration`}>
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
