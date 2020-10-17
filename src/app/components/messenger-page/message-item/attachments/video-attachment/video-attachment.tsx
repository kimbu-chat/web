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
			<div className='video-attachment__preview'>
				<img src={attachment.firstFrameUrl} alt='' className='video-attachment__img' />
				<PlaySvg viewBox='0 0 25 25' />
				<div className='video-attachment__duration'>
					{moment.utc(attachment.durationInSeconds * 1000).format('mm:ss')}
				</div>
			</div>
			<div className='video-attachment__aside'>
				<div className='video-attachment__details'>
					<div className='video-attachment__name'>{attachment.fileName}</div>
					<div className='video-attachment__size'>
						{attachment.byteSize > 1048575
							? `${(attachment.byteSize / 1048576).toFixed(2)} Mb`
							: attachment.byteSize > 1024
							? `${(attachment.byteSize / 1024).toFixed(2)} Kb`
							: `${attachment.byteSize.toFixed(2)} bytes`}
					</div>
				</div>
				<div className='video-attachment__buttons'>
					<a className='video-attachment__btn'>Save file</a>
					<button className='video-attachment__btn'>Play video</button>
				</div>
			</div>
		</div>
	);
};

export default VideoAttachment;
