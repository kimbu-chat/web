import { BackgroundBlur } from 'app/components/shared/with-background';
import React from 'react';
import CloseSVG from 'icons/ic-close.svg';

import './big-photo.scss';
import { stopPropagation } from 'utils/functions/stop-propagation';

namespace BigPhoto {
	export interface Props {
		url: string;
		onClose: () => void;
	}
}

export const BigPhoto: React.FC<BigPhoto.Props> = React.memo(({ url, onClose }) => {
	return (
		<BackgroundBlur onClick={onClose}>
			<img onClick={stopPropagation} src={url} alt='' className='big-photo' />
			<CloseSVG className='big-photo__close' viewBox='0 0 25 25' />
		</BackgroundBlur>
	);
});
