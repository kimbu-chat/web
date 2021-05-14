import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ReactComponent as PictureSvg } from '@icons/picture.svg';
import { ReactComponent as VideoSvg } from '@icons/attachment-video.svg';
import { ReactComponent as FilesSvg } from '@icons/files.svg';
import { ReactComponent as VoiceSvg } from '@icons/voice.svg';
import { ReactComponent as AudioSvg } from '@icons/song.svg';
import { ReactComponent as OpenArrowSvg } from '@icons/open-arrow.svg';
import {
  getPictureAttachmentsCountSelector,
  getVideoAttachmentsCountSelector,
  getFilesAttachmentsCountSelector,
  getVoiceAttachmentsCountSelector,
  getAudioAttachmentsCountSelector,
} from '@store/chats/selectors';

import { AudioList } from './audio-list/audio-list';
import { PhotoList } from './photo-list/photo-list';
import { RecordingsList } from './recordings-list/recordings-list';
import { VideoList } from './video-list/video-list';
import { FileList } from './file-list/file-list';

import './chat-media.scss';

export const ChatMedia = () => {
  const { t } = useTranslation();

  const [pictureDisplayed, setPictureDisplayed] = useState(false);
  const [videoDisplayed, setVideoDisplayed] = useState(false);
  const [filesDisplayed, setFilesDisplayed] = useState(false);
  const [voiceDisplayed, setVoiceDisplayed] = useState(false);
  const [audioDisplayed, setAudioDisplayed] = useState(false);

  const changePictureDisplayedState = useCallback(
    () => setPictureDisplayed((oldState) => !oldState),
    [setPictureDisplayed],
  );
  const changeVideoDisplayedState = useCallback(() => setVideoDisplayed((oldState) => !oldState), [
    setVideoDisplayed,
  ]);
  const changeFilesDisplayedState = useCallback(() => setFilesDisplayed((oldState) => !oldState), [
    setFilesDisplayed,
  ]);
  const changeVoiceDisplayedState = useCallback(() => setVoiceDisplayed((oldState) => !oldState), [
    setVoiceDisplayed,
  ]);
  const changeAudioDisplayedState = useCallback(() => setAudioDisplayed((oldState) => !oldState), [
    setAudioDisplayed,
  ]);

  const pictureAttachmentsCount = useSelector(getPictureAttachmentsCountSelector);
  const videoAttachmentsCount = useSelector(getVideoAttachmentsCountSelector);
  const filesAttachmentsCount = useSelector(getFilesAttachmentsCountSelector);
  const voiceAttachmentsCount = useSelector(getVoiceAttachmentsCountSelector);
  const audioAttachmentsCount = useSelector(getAudioAttachmentsCountSelector);

  const totalAttacchmentsCount =
    pictureAttachmentsCount +
    videoAttachmentsCount +
    filesAttachmentsCount +
    voiceAttachmentsCount +
    audioAttachmentsCount;

  return (
    <>
      {totalAttacchmentsCount > 0 && (
        <div className="chat-media">
          <h3 className="chat-media__title">{t('chatMedia.media')}</h3>
          {pictureAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <div className="chat-media__media-heading">
                <PictureSvg />
                <div className="chat-media__media-title">
                  {t('chatMedia.picture', { count: pictureAttachmentsCount })}
                </div>
                <button
                  type="button"
                  onClick={changePictureDisplayedState}
                  className={`chat-media__open-arrow ${
                    pictureDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </button>
              </div>
              {pictureDisplayed && <PhotoList />}
            </div>
          )}
          {videoAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <div className="chat-media__media-heading">
                <VideoSvg />
                <div className="chat-media__media-title">
                  {t('chatMedia.video', { count: videoAttachmentsCount })}
                </div>
                <button
                  type="button"
                  onClick={changeVideoDisplayedState}
                  className={`chat-media__open-arrow ${
                    videoDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </button>
              </div>
              {videoDisplayed && <VideoList />}
            </div>
          )}
          {audioAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <div className="chat-media__media-heading">
                <AudioSvg />
                <div className="chat-media__media-title">
                  {t('chatMedia.audio', { count: audioAttachmentsCount })}
                </div>
                <button
                  type="button"
                  onClick={changeAudioDisplayedState}
                  className={`chat-media__open-arrow ${
                    audioDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </button>
              </div>
              {audioDisplayed && <AudioList />}
            </div>
          )}
          {voiceAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <div className="chat-media__media-heading">
                <VoiceSvg viewBox="0 0 20 24" />
                <div className="chat-media__media-title">
                  {t('chatMedia.voice', { count: voiceAttachmentsCount })}
                </div>
                <button
                  type="button"
                  onClick={changeVoiceDisplayedState}
                  className={`chat-media__open-arrow ${
                    voiceDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </button>
              </div>
              {voiceDisplayed && <RecordingsList />}
            </div>
          )}
          {filesAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <div className="chat-media__media-heading">
                <FilesSvg />
                <div className="chat-media__media-title">
                  {t('chatMedia.file', { count: filesAttachmentsCount })}
                </div>
                <button
                  type="button"
                  onClick={changeFilesDisplayedState}
                  className={`chat-media__open-arrow ${
                    filesDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </button>
              </div>
              {filesDisplayed && <FileList />}
            </div>
          )}
        </div>
      )}
    </>
  );
};