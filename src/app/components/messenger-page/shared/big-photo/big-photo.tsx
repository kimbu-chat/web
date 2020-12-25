import { BackgroundBlur } from 'components';
import React from 'react';
import CloseSVG from 'icons/ic-close.svg';

import './big-photo.scss';
import { stopPropagation } from 'app/utils/stop-propagation';

namespace BigPhotoNS {
  export interface Props {
    url: string;
    onClose: () => void;
  }
}

export const BigPhoto: React.FC<BigPhotoNS.Props> = React.memo(({ url, onClose }) => (
  <BackgroundBlur onClick={onClose}>
    <img draggable='false' onClick={stopPropagation} src={url} alt='' className='big-photo' />
    <CloseSVG className='big-photo__close' viewBox='0 0 25 25' />
  </BackgroundBlur>
));
