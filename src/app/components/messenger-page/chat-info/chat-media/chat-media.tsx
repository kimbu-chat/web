import React, { useContext } from 'react';
import './chat-media.scss';

import PhotoSvg from 'app/assets/icons/ic-photo.svg';
import VideoSvg from 'app/assets/icons/ic-video-call.svg';
import FileSvg from 'app/assets/icons/ic-documents.svg';
// import LinkSvg from 'app/assets/icons/ic-links.svg';
import MicrophoneSvg from 'app/assets/icons/ic-microphone.svg';
// import PeopleSvg from 'app/assets/icons/ic-group.svg';

import { LocalizationContext } from 'app/app';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { useSelector } from 'react-redux';

const ChatMedia = () => {
	const { t } = useContext(LocalizationContext);
	const selectedChat = useSelector(getSelectedChatSelector);

	const location = useLocation();

	return (
		<div className='chat-media'>
			<div className='chat-media__heading'>{t('chatMedia.media')}</div>
			<Link to={`${location.pathname}/photo`} className='chat-media__media-type'>
				<PhotoSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>
					{t('chatMedia.photos', { count: selectedChat?.pictureAttachmentsCount })}
				</span>
			</Link>
			<Link to={`${location.pathname}/video`} className='chat-media__media-type'>
				<VideoSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>
					{t('chatMedia.videos', { count: selectedChat?.videoAttachmentsCount })}
				</span>
			</Link>
			<Link to={`${location.pathname}/files`} className='chat-media__media-type'>
				<FileSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>
					{t('chatMedia.files', { count: selectedChat?.rawAttachmentsCount })}
				</span>
			</Link>
			{/* <button className='chat-media__media-type'>
				<LinkSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.shared-links', { count: 29 })}</span>
			</button> */}
			<Link to={`${location.pathname}/audio-recordings`} className='chat-media__media-type'>
				<MicrophoneSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>
					{t('chatMedia.voice-messages', { count: selectedChat?.voiceAttachmentsCount })}
				</span>
			</Link>
			{/* <button className='chat-media__media-type'>
				<PeopleSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.common-groups', { count: 4 })}</span>
			</button> */}
		</div>
	);
};

export default ChatMedia;
