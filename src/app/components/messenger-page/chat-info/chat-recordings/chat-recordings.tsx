import React, { useContext } from 'react';
import './chat-recordings.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { Link } from 'react-router-dom';
import { LocalizationContext } from 'app/app';
import moment from 'moment';
import PlaySvg from 'app/assets/icons/ic-play.svg';
import PauseSvg from 'app/assets/icons/ic-pause.svg';

import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';

const ChatRecordings = () => {
	const { t } = useContext(LocalizationContext);
	//!HARDCODE
	const recordings = [
		{
			url: 'https://ringon.site/?do=download&id=5693',
			durationInSeconds: 29,
		},
		{
			url: 'https://ringon.site/?do=download&id=5693',
			durationInSeconds: 29,
		},
		{
			url: 'https://ringon.site/?do=download&id=5693',
			durationInSeconds: 29,
		},
		{
			url: 'https://ringon.site/?do=download&id=5693',
			durationInSeconds: 29,
		},
	];
	return (
		<div className='chat-recordings'>
			<div className='chat-recordings__top'>
				<Link to={location.pathname.replace('/audio-recordings', '')} className='chat-recordings__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</Link>
				<div className='chat-recordings__heading'>{t('chatRecordings.recordings')}</div>
			</div>
			<div className='chat-recordings__recordings'>
				{recordings.map((recording) => (
					<AudioPlayer
						src={recording.url}
						preload='none'
						defaultCurrentTime={
							<span>{moment.utc(recording.durationInSeconds * 1000).format('mm:ss')}</span>
						}
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
				))}
			</div>
		</div>
	);
};

export default ChatRecordings;
