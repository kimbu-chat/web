import React, { useCallback, useState } from 'react';
import './video-attachment.scss';

import PlaySvg from 'app/assets/icons/ic-play.svg';
import { VideoBase } from 'app/store/messages/models';
import moment from 'moment';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import VideoPlayer from './video-player/video-player';

namespace VideoAttachment {
	export interface Props {
		attachment: VideoBase;
	}
}

const VideoAttachment = ({ attachment }: VideoAttachment.Props) => {
	const [videoPlayerDisplayed, setVideoPlayerDisplayed] = useState(false);
	const changeVideoPlayerDisplayed = useCallback(() => {
		setVideoPlayerDisplayed((oldState) => !oldState);
		console.log('78');
	}, [setVideoPlayerDisplayed]);

	return (
		<div onClick={changeVideoPlayerDisplayed} className='video-attachment'>
			<img src={attachment.firstFrameUrl} alt='' className='video-attachment__img' />
			<div className='video-attachment__blur'></div>
			<PlaySvg className='video-attachment__svg' viewBox='0 0 25 25' />
			<div className='video-attachment__duration'>
				{moment.utc(attachment.durationInSeconds * 1000).format('mm:ss')}
			</div>

			<FadeAnimationWrapper isDisplayed={videoPlayerDisplayed}>
				<VideoPlayer url={attachment.url} onClose={changeVideoPlayerDisplayed} />
			</FadeAnimationWrapper>
		</div>
	);
};

export default VideoAttachment;
