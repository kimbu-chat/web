import { BackgroundBlur } from 'app/components/shared/with-background';
import React, { useCallback } from 'react';
import CloseSVG from 'app/assets/icons/ic-close.svg';

import './big-photo.scss';

namespace BigPhoto {
	export interface Props {
		url: string;
		onClose: () => void;
	}
}

const BigPhoto: React.FC<BigPhoto.Props> = ({ url, onClose }) => {
	const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation(), []);

	return (
		<BackgroundBlur onClick={onClose}>
			<img onClick={stopPropagation} src={url} alt='' className='big-photo' />
			<CloseSVG className='big-photo__close' viewBox='0 0 25 25' />
		</BackgroundBlur>
	);
};

export default BigPhoto;
