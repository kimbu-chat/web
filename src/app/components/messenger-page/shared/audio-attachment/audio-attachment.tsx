import React, { useCallback, useEffect, useRef, useState } from 'react';
import './audio-attachment.scss';

import PlaySvg from 'icons/ic-play.svg';
import PauseSvg from 'icons/ic-pause.svg';
import moment from 'moment';
import { changeMusic } from 'app/utils/current-music';
import { IAudioAttachment } from 'store/chats/models';

interface IMessageAudioAttachmentProps {
  attachment: IAudioAttachment;
}

export const MessageAudioAttachment: React.FC<IMessageAudioAttachmentProps> = React.memo(({ attachment }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audio = useRef<HTMLAudioElement | null>(null);

  const playPauseAudio = useCallback(() => {
    changeMusic(audio.current, setIsPlaying, true);
  }, [setIsPlaying, isPlaying, attachment, audio]);

  const onEnded = useCallback(() => setIsPlaying(false), [setIsPlaying]);

  useEffect(
    () => () => {
      changeMusic(null);
    },
    [setIsPlaying],
  );

  return (
    <div className='audio-attachment'>
      <audio onEnded={onEnded} ref={audio} hidden src={attachment.url} />
      <button type='button' onClick={playPauseAudio} className='audio-attachment__download'>
        {isPlaying ? <PauseSvg viewBox='0 0 25 25' /> : <PlaySvg viewBox='0 0 25 25' />}
      </button>
      <div className='audio-attachment__data'>
        <h4 className='audio-attachment__file-name'>{attachment.title}</h4>
        <div className='audio-attachment__duration'>{moment.utc(attachment.duration * 1000).format('mm:ss')}</div>
      </div>
    </div>
  );
});
