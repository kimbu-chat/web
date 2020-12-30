import React, { useCallback, useRef, useState } from 'react';
import './audio-attachment.scss';

import PlaySvg from 'icons/ic-play.svg';
import PauseSvg from 'icons/ic-pause.svg';
import moment from 'moment';
import { changeMusic } from 'app/utils/current-music';
import { IAudioAttachment } from 'store/chats/models';

namespace AudioAttachmentNS {
  export interface IProps {
    attachment: IAudioAttachment;
  }
}

export const MessageAudioAttachment = React.memo(({ attachment }: AudioAttachmentNS.IProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audio = useRef<HTMLAudioElement | null>(null);

  const playPauseAudio = useCallback(() => {
    if (!audio.current) {
      audio.current = new Audio(attachment.url);
    }
    changeMusic(audio.current, setIsPlaying, true);
  }, [setIsPlaying, isPlaying, attachment]);

  return (
    <div className='audio-attachment'>
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
