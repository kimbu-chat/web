import React from 'react';
import './chat-media.scss';

import PhotoSvg from 'app/assets/ic-photo.svg';
import VideoSvg from 'app/assets/ic-video-call.svg';
//import FileSvg from 'app/assets/';
//import LinkSvg from 'app/assets/';
import MicrophoneSvg from 'app/assets/ic-microphone.svg';
//import PeopleSvg from 'app/assets/';

const ChatMedia = () => {
	return (
		<div className='chat-media'>
			<div className='chat-media__heading'>{t('chatActions.actions')}</div>
			<button className='chat-media__action'>
				<PhotoSvg className='chat-media__action__svg' />
				<span className='chat-media__action__name'>{t('chatActions.clear-history')}</span>
			</button>
			<button className='chat-media__action'>
				<VideoSvg className='chat-media__action__svg' />
				<span className='chat-media__action__name'>{t('chatActions.clear-history')}</span>
			</button>
		</div>
	);
};

export default ChatMedia;
