import React, { useCallback, useState } from 'react';
import './video-attachment.scss';

import PlaySvg from 'app/assets/icons/ic-play.svg';
import moment from 'moment';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import VideoPlayer from '../../../shared/video-player/video-player';
import { VideoAttachment } from 'app/store/chats/models';

namespace VideoAttachmentNS {
	export interface Props {
		attachment: VideoAttachment;
	}
}

const MessageVideoAttachment = ({ attachment }: VideoAttachmentNS.Props) => {
	const [videoPlayerDisplayed, setVideoPlayerDisplayed] = useState(false);
	const changeVideoPlayerDisplayed = useCallback(() => setVideoPlayerDisplayed((oldState) => !oldState), [
		setVideoPlayerDisplayed,
	]);

	return (
		<>
			<div onClick={changeVideoPlayerDisplayed} className='video-attachment'>
				<img src={attachment.firstFrameUrl} alt='' className='video-attachment__img' />
				<div className='video-attachment__blur'></div>
				<PlaySvg className='video-attachment__svg' viewBox='0 0 25 25' />
				<div className='video-attachment__duration'>
					{moment.utc(attachment.duration * 1000).format('mm:ss')}
				</div>
			</div>
			<FadeAnimationWrapper isDisplayed={videoPlayerDisplayed}>
				<VideoPlayer url={attachment.url} onClose={changeVideoPlayerDisplayed} />
			</FadeAnimationWrapper>
		</>
	);
};

export default MessageVideoAttachment;
