import React from 'react';
import './video-attachment.scss';

import PlaySvg from 'app/assets/icons/ic-play.svg';
import { VideoBase } from 'app/store/messages/models';
import moment from 'moment';

namespace VideoAttachment {
	export interface Props {
		attachment: VideoBase;
	}
}

const VideoAttachment = ({ attachment }: VideoAttachment.Props) => {
	return (
		<div className='video-attachment'>
			<img src={attachment.firstFrameUrl} alt='' className='video-attachment__img' />
			<div className='video-attachment__blur'></div>
			<PlaySvg className='video-attachment__svg' viewBox='0 0 25 25' />
			<div className='video-attachment__duration'>
				{moment.utc(attachment.durationInSeconds * 1000).format('mm:ss')}
			</div>
		</div>
	);
};

export default VideoAttachment;
