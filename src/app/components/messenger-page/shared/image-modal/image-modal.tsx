import { BackgroundBlur } from 'components';
import React from 'react';
import CloseSVG from 'icons/ic-close.svg';

import './image-modal.scss';
import { stopPropagation } from 'app/utils/stop-propagation';

interface IImageModalProps {
  url: string;
  onClose: () => void;
}

export const ImageModal: React.FC<IImageModalProps> = React.memo(({ url, onClose }) => (
  <BackgroundBlur onClick={onClose}>
    <img onClick={stopPropagation} src={url} alt='' className='big-photo' />
    <CloseSVG className='big-photo__close' viewBox='0 0 25 25' />
  </BackgroundBlur>
));
