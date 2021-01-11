import { BackgroundBlur } from 'components';
import React from 'react';
import CloseSVG from 'icons/ic-close.svg';

import './video-player.scss';

interface IVideoPlayerProps {
  url: string;
  onClose: () => void;
}

export const VideoPlayer: React.FC<IVideoPlayerProps> = React.memo(({ url, onClose }) => (
  <BackgroundBlur onClick={onClose}>
    <video preload='metadata' autoPlay controls src={url} className='video-player' />
    <CloseSVG className='video-player__close' viewBox='0 0 25 25' />
  </BackgroundBlur>
));
