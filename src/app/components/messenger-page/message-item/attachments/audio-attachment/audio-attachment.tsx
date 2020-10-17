import { AudioBase } from 'app/store/messages/models';
import React from 'react';
import './audio-attachment.scss';

import AudioPlayer from 'react-h5-audio-player';
import moment from 'moment';

namespace AudioAttachment {
	export interface Props {
		attachment: AudioBase;
	}
}

const AudioAttachment = ({ attachment }: AudioAttachment.Props) => {
	return (
		<div className='audio-attachment'>
			<AudioPlayer
				header={<div className='audio-attachment__title'>{attachment.fileName}</div>}
				src={attachment.url}
				preload='none'
				defaultDuration={moment.utc(attachment.durationInSeconds * 1000).format('mm:ss')}
				showSkipControls={false}
				showJumpControls={false}
				autoPlayAfterSrcChange={false}
			/>
		</div>
	);
};

export default AudioAttachment;
