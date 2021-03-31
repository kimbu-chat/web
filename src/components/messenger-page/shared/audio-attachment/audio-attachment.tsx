import React, { useCallback, useEffect, useRef, useState } from 'react';
import './audio-attachment.scss';

import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import moment from 'moment';
import { changeMusic } from '@utils/current-music';
import { IAudioAttachment } from '@store/chats/models';
import AudioPlayer from 'react-h5-audio-player';

interface IMessageAudioAttachmentProps {
  attachment: IAudioAttachment;
}

export const MessageAudioAttachment: React.FC<IMessageAudioAttachmentProps> = React.memo(
  ({ attachment }) => {
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
              {moment.utc(attachment.duration * 1000).format('mm:ss')}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
