import { BackgroundBlur } from 'app/components/shared/with-background';
import React from 'react';
import CloseSVG from 'icons/ic-close.svg';

import './video-player.scss';

namespace VideoPlayer {
	export interface Props {
		url: string;
		onClose: () => void;
	}
}

const VideoPlayer: React.FC<VideoPlayer.Props> = ({ url, onClose }) => {
	return (
		<BackgroundBlur onClick={onClose}>
			<video preload='metadata' controls src={`${url}#t=5`} className='video-player' />
			<CloseSVG className='video-player__close' viewBox='0 0 25 25' />
		</BackgroundBlur>
	);
};

export default VideoPlayer;
