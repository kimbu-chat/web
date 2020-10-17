import { RecordingBase } from 'app/store/messages/models';
import React from 'react';
import './recording-attachment.scss';

import AudioPlayer from 'react-h5-audio-player';
import moment from 'moment';

namespace RecordingAttachment {
	export interface Props {
		attachment: RecordingBase;
	}
}

const RecordingAttachment = ({ attachment }: RecordingAttachment.Props) => {
	return (
		<div className='recording-attachment'>
			<AudioPlayer
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

export default RecordingAttachment;
