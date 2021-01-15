import React, { useCallback, useContext, useState } from 'react';
import './chat-media.scss';

import { LocalizationContext } from 'app/app';

import PhotoSvg from 'icons/photo.svg';
import VideoSvg from 'icons/video.svg';
import FilesSvg from 'icons/files.svg';
import VoiceSvg from 'icons/voice.svg';
import OpenArrowSvg from 'icons/open-arrow.svg';

export const ChatMedia = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const [photoDisplayed, setPhotoDisplayed] = useState(false);
  const [videoDisplayed, setVideoDisplayed] = useState(false);
  const [filesDisplayed, setFilesDisplayed] = useState(false);
  const [voiceDisplayed, setVoiceDisplayed] = useState(false);
  const [audioDisplayed, setAudioDisplayed] = useState(false);

  const changePhotoDisplayedState = useCallback(() => setPhotoDisplayed((oldState) => !oldState), [setPhotoDisplayed]);
  const changeVideoDisplayedState = useCallback(() => setVideoDisplayed((oldState) => !oldState), [setVideoDisplayed]);
  const changeFilesDisplayedState = useCallback(() => setFilesDisplayed((oldState) => !oldState), [setFilesDisplayed]);
  const changeVoiceDisplayedState = useCallback(() => setVoiceDisplayed((oldState) => !oldState), [setVoiceDisplayed]);
  const changeAudioDisplayedState = useCallback(() => setAudioDisplayed((oldState) => !oldState), [setAudioDisplayed]);

  return (
    <div className='chat-media'>
      <h3 className='chat-media__title'>{t('chatMedia.media')}</h3>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <PhotoSvg />
          <div className='chat-media__media-title'>{t('chatMedia.photo')}</div>
          <button
            type='button'
            onClick={changePhotoDisplayedState}
            className={`chat-media__open-arrow ${photoDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
      </div>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <VideoSvg />
          <div className='chat-media__media-title'>{t('chatMedia.video')}</div>
          <button
            type='button'
            onClick={changeVideoDisplayedState}
            className={`chat-media__open-arrow ${videoDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
      </div>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <FilesSvg />
          <div className='chat-media__media-title'>{t('chatMedia.file')}</div>
          <button
            type='button'
            onClick={changeFilesDisplayedState}
            className={`chat-media__open-arrow ${filesDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
      </div>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <VoiceSvg />
          <div className='chat-media__media-title'>{t('chatMedia.voice')}</div>
          <button
            type='button'
            onClick={changeVoiceDisplayedState}
            className={`chat-media__open-arrow ${voiceDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
      </div>
      <div className='chat-media__media-group'>
        <div className='chat-media__media-heading'>
          <VoiceSvg />
          <div className='chat-media__media-title'>{t('chatMedia.audio')}</div>
          <button
            type='button'
            onClick={changeAudioDisplayedState}
            className={`chat-media__open-arrow ${audioDisplayed ? 'chat-media__open-arrow--rotated' : ''}`}
          >
            <OpenArrowSvg />
          </button>
        </div>
      </div>
    </div>
  );
});
