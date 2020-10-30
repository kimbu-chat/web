import React, { useContext } from 'react';
import './chat-recordings.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { Link } from 'react-router-dom';
import { LocalizationContext } from 'app/app';
import ChatRecording from './chat-recording/chat-recording';

const ChatRecordings = () => {
	const { t } = useContext(LocalizationContext);
	//!HARDCODE
	const recordings = [
		{
			url: 'https://ringon.site/?do=download&id=5693',
			durationInSeconds: 29,
			id: 77,
		},
		{
			url: 'https://ringon.site/?do=download&id=5693',
			durationInSeconds: 29,
			id: 771,
		},
		{
			url: 'https://ringon.site/?do=download&id=5693',
			durationInSeconds: 29,
			id: 72,
		},
		{
			url: 'https://ringon.site/?do=download&id=5693',
			durationInSeconds: 29,
			id: 773,
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
					<ChatRecording key={recording.id} recording={recording} />
				))}
			</div>
		</div>
	);
};

export default ChatRecordings;
