import React, { useCallback, useContext, useState } from 'react';
import './chat-media.scss';

import { LocalizationContext } from 'app/app';

import PictureSvg from 'icons/picture.svg';
import VideoSvg from 'icons/video.svg';
import FilesSvg from 'icons/files.svg';
import VoiceSvg from 'icons/voice.svg';
import AudioSvg from 'icons/audio.svg';
import OpenArrowSvg from 'icons/open-arrow.svg';

import {
  getPictureAttachmentsCountSelector,
  getVideoAttachmentsCountSelector,
  getFilesAttachmentsCountSelector,
  getVoiceAttachmentsCountSelector,
  getAudioAttachmentsCountSelector,
} from 'app/store/chats/selectors';

import { useSelector } from 'react-redux';

import { AudioList } from './audio-list/audio-list';
import { PhotoList } from './photo-list/photo-list';
import { RecordingsList } from './recordings-list/recordings-list';
import { VideoList } from './video-list/video-list';
import { FileList } from './file-list/file-list';

export const ChatMedia = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const [pictureDisplayed, setPictureDisplayed] = useState(false);
  const [videoDisplayed, setVideoDisplayed] = useState(false);
  const [filesDisplayed, setFilesDisplayed] = useState(false);
  const [voiceDisplayed, setVoiceDisplayed] = useState(false);
  const [audioDisplayed, setAudioDisplayed] = useState(false);

  const changePictureDisplayedState = useCallback(() => setPictureDisplayed((oldState) => !oldState), [setPictureDisplayed]);
  const changeVideoDisplayedState = useCallback(() => setVideoDisplayed((oldState) => !oldState), [setVideoDisplayed]);
  const changeFilesDisplayedState = useCallback(() => setFilesDisplayed((oldState) => !oldState), [setFilesDisplayed]);
  const changeVoiceDisplayedState = useCallback(() => setVoiceDisplayed((oldState) => !oldState), [setVoiceDisplayed]);
  const changeAudioDisplayedState = useCallback(() => setAudioDisplayed((oldState) => !oldState), [setAudioDisplayed]);

  const pictureAttachmentsCount = useSelector(getPictureAttachmentsCountSelector);
  const videoAttachmentsCount = useSelector(getVideoAttachmentsCountSelector);
  const filesAttachmentsCount = useSelector(getFilesAttachmentsCountSelector);
  const voiceAttachmentsCount = useSelector(getVoiceAttachmentsCountSelector);
  const audioAttachmentsCount = useSelector(getAudioAttachmentsCountSelector);

  return (
    <div className='chat-media'>
      <h3 className='chat-media__title'>{t('chatMedia.media')}</h3>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <PictureSvg />
          <div className='chat-media__media-title'>{t('chatMedia.picture', { count: pictureAttachmentsCount || 0 })}</div>
          <button
            type='button'
            onClick={changePictureDisplayedState}
            className={`chat-media__open-arrow ${pictureDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
        {pictureDisplayed && <PhotoList />}
      </div>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <VideoSvg />
          <div className='chat-media__media-title'>{t('chatMedia.video', { count: videoAttachmentsCount || 0 })}</div>
          <button
            type='button'
            onClick={changeVideoDisplayedState}
            className={`chat-media__open-arrow ${videoDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
        {videoDisplayed && <VideoList />}
      </div>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <AudioSvg />
          <div className='chat-media__media-title'>{t('chatMedia.audio', { count: audioAttachmentsCount || 0 })}</div>
          <button
            type='button'
            onClick={changeAudioDisplayedState}
            className={`chat-media__open-arrow ${audioDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
        {audioDisplayed && <AudioList />}
      </div>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <VoiceSvg viewBox='0 0 20 24' />
          <div className='chat-media__media-title'>{t('chatMedia.voice', { count: voiceAttachmentsCount || 0 })}</div>
          <button
            type='button'
            onClick={changeVoiceDisplayedState}
            className={`chat-media__open-arrow ${voiceDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
        {voiceDisplayed && <RecordingsList />}
      </div>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <FilesSvg />
          <div className='chat-media__media-title'>{t('chatMedia.file', { count: filesAttachmentsCount || 0 })}</div>
          <button
            type='button'
            onClick={changeFilesDisplayedState}
            className={`chat-media__open-arrow ${filesDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
        {filesDisplayed && <FileList />}
      </div>
    </div>
  );
});
