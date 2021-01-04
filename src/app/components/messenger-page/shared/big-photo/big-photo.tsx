import { BackgroundBlur } from 'components';
import React from 'react';
import CloseSVG from 'icons/ic-close.svg';

import './big-photo.scss';
import { stopPropagation } from 'app/utils/stop-propagation';

interface IBigPhotoProps {
  url: string;
  onClose: () => void;
}

export const BigPhoto: React.FC<IBigPhotoProps> = React.memo(({ url, onClose }) => (
  <BackgroundBlur onClick={onClose}>
    <img onClick={stopPropagation} src={url} alt='' className='big-photo' />
    <CloseSVG className='big-photo__close' viewBox='0 0 25 25' />
  </BackgroundBlur>
));
