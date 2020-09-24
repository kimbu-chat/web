import React, { useContext } from 'react';
import './chat-media.scss';

import PhotoSvg from 'app/assets/icons/ic-photo.svg';
import VideoSvg from 'app/assets/icons/ic-video-call.svg';
import FileSvg from 'app/assets/icons/ic-documents.svg';
import LinkSvg from 'app/assets/icons/ic-links.svg';
import MicrophoneSvg from 'app/assets/icons/ic-microphone.svg';
import PeopleSvg from 'app/assets/icons/ic-group.svg';

import { LocalizationContext } from 'app/app';

const ChatMedia = () => {
	const { t } = useContext(LocalizationContext);

	return (
		<div className='chat-media'>
			<div className='chat-media__heading'>{t('chatMedia.media')}</div>
			<button className='chat-media__media-type'>
				<PhotoSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.photos', { count: 155 })}</span>
			</button>
			<button className='chat-media__media-type'>
				<VideoSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.videos', { count: 7 })}</span>
			</button>
			<button className='chat-media__media-type'>
				<FileSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.files', { count: 43 })}</span>
			</button>
			<button className='chat-media__media-type'>
				<LinkSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.shared-links', { count: 29 })}</span>
			</button>
			<button className='chat-media__media-type'>
				<MicrophoneSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.voice-messages', { count: 129 })}</span>
			</button>
			<button className='chat-media__media-type'>
				<PeopleSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.common-groups', { count: 4 })}</span>
			</button>
		</div>
	);
};

export default ChatMedia;
