import React, { useContext } from 'react';
import './chat-media.scss';

import PhotoSvg from 'icons/ic-photo.svg';
import VideoSvg from 'icons/ic-video-call.svg';
import FileSvg from 'icons/ic-documents.svg';
// import LinkSvg from 'icons/ic-links.svg';
import MicrophoneSvg from 'icons/ic-microphone.svg';
import PlaySvg from 'icons/ic-play.svg';
// import PeopleSvg from 'icons/ic-group.svg';

import { LocalizationContext } from 'app/app';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { useSelector } from 'react-redux';

export const ChatMedia = React.memo(() => {
  const { t } = useContext(LocalizationContext);
  const selectedChat = useSelector(getSelectedChatSelector);

  const location = useLocation();

  return (
    <div className='chat-media'>
      <div className='chat-media__heading'>{t('chatMedia.media')}</div>
      <Link to={location.pathname.replace('info', 'info/photo')} className='chat-media__media-type'>
        <PhotoSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
        <span className='chat-media__media-type__name'>{t('chatMedia.photos', { count: selectedChat?.pictureAttachmentsCount || 0 })}</span>
      </Link>
      <Link to={location.pathname.replace('info', 'info/video')} className='chat-media__media-type'>
        <VideoSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
        <span className='chat-media__media-type__name'>{t('chatMedia.videos', { count: selectedChat?.videoAttachmentsCount || 0 })}</span>
      </Link>
      <Link to={location.pathname.replace('info', 'info/files')} className='chat-media__media-type'>
        <FileSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
        <span className='chat-media__media-type__name'>{t('chatMedia.files', { count: selectedChat?.rawAttachmentsCount || 0 })}</span>
      </Link>
      {/* <button type='button' className='chat-media__media-type'>
				<LinkSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.shared-links', { count: 29 })}</span>
			</button> */}
      <Link to={location.pathname.replace('info', 'info/audio-recordings')} className='chat-media__media-type'>
        <MicrophoneSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
        <span className='chat-media__media-type__name'>{t('chatMedia.voice-messages', { count: selectedChat?.voiceAttachmentsCount || 0 })}</span>
      </Link>
      <Link to={location.pathname.replace('info', 'info/audios')} className='chat-media__media-type'>
        <PlaySvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
        <span className='chat-media__media-type__name'>{t('chatMedia.audios', { count: selectedChat?.audioAttachmentsCount || 0 })}</span>
      </Link>
      {/* <button type='button' className='chat-media__media-type'>
				<PeopleSvg viewBox='0 0 25 25' className='chat-media__media-type__svg' />
				<span className='chat-media__media-type__name'>{t('chatMedia.common-groups', { count: 4 })}</span>
			</button> */}
    </div>
  );
});
