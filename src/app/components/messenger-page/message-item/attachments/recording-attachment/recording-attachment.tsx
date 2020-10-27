import { RecordingBase } from 'app/store/messages/models';
import React from 'react';
import './recording-attachment.scss';

import PlaySvg from 'app/assets/icons/ic-play.svg';
import PauseSvg from 'app/assets/icons/ic-pause.svg';

import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
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
				defaultCurrentTime={<span>{moment.utc(attachment.durationInSeconds * 1000).format('mm:ss')}</span>}
				showSkipControls={false}
				showJumpControls={false}
				autoPlayAfterSrcChange={false}
				layout='horizontal-reverse'
				customProgressBarSection={[RHAP_UI.PROGRESS_BAR, RHAP_UI.CURRENT_TIME]}
				customControlsSection={[RHAP_UI.MAIN_CONTROLS]}
				customAdditionalControls={[]}
				customIcons={{
					play: (
						<div className='recording-attachment__btn'>
							<PlaySvg viewBox='0 0 25 25' />
						</div>
					),
					pause: (
						<div className='recording-attachment__btn'>
							<PauseSvg viewBox='0 0 25 25' />
						</div>
					),
				}}
			/>
		</div>
	);
};

export default RecordingAttachment;
