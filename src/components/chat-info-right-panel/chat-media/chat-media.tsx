import React, {RefObject, useCallback, useState} from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ReactComponent as VideoSvg } from '@icons/attachment-video.svg';
import { ReactComponent as FilesSvg } from '@icons/files.svg';
import { ReactComponent as OpenArrowSvg } from '@icons/open-arrow.svg';
import { ReactComponent as PictureSvg } from '@icons/picture.svg';
import { ReactComponent as AudioSvg } from '@icons/song.svg';
import { ReactComponent as VoiceSvg } from '@icons/voice.svg';
import {
  getPictureAttachmentsCountSelector,
  getVideoAttachmentsCountSelector,
  getFilesAttachmentsCountSelector,
  getVoiceAttachmentsCountSelector,
  getAudioAttachmentsCountSelector,
} from '@store/chats/selectors';

import { AudioList } from './audio-list/audio-list';
import { FileList } from './file-list/file-list';
import { PhotoList } from './photo-list/photo-list';
import { RecordingsList } from './recordings-list/recordings-list';
import { VideoList } from './video-list/video-list';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './chat-media.scss';

type ChatMediaProps = {
  observeIntersection: ObserveFn;
  rootRef: RefObject<HTMLDivElement>;
};

export const ChatMedia: React.FC<ChatMediaProps> = ({ observeIntersection, rootRef }) => {
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
  const changeVideoDisplayedState = useCallback(
    () => setVideoDisplayed((oldState) => !oldState),
    [setVideoDisplayed],
  );
  const changeFilesDisplayedState = useCallback(
    () => setFilesDisplayed((oldState) => !oldState),
    [setFilesDisplayed],
  );
  const changeVoiceDisplayedState = useCallback(
    () => setVoiceDisplayed((oldState) => !oldState),
    [setVoiceDisplayed],
  );
  const changeAudioDisplayedState = useCallback(
    () => setAudioDisplayed((oldState) => !oldState),
    [setAudioDisplayed],
  );

  const pictureAttachmentsCount = useSelector(getPictureAttachmentsCountSelector);
  const videoAttachmentsCount = useSelector(getVideoAttachmentsCountSelector);
  const filesAttachmentsCount = useSelector(getFilesAttachmentsCountSelector);
  const voiceAttachmentsCount = useSelector(getVoiceAttachmentsCountSelector);
  const audioAttachmentsCount = useSelector(getAudioAttachmentsCountSelector);

  const totalAttachmentsCount =
    pictureAttachmentsCount +
    videoAttachmentsCount +
    filesAttachmentsCount +
    voiceAttachmentsCount +
    audioAttachmentsCount;

  return (
    <>
      {totalAttachmentsCount > 0 && (
        <div className="chat-media">
          <h3 className="chat-media__title">{t('chatMedia.media')}</h3>
          {pictureAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <button
                onClick={changePictureDisplayedState}
                type="button"
                className="chat-media__media-heading">
                <PictureSvg />
                <div className="chat-media__media-title">
                  {t('chatMedia.picture', { count: pictureAttachmentsCount })}
                </div>
                <div
                  className={`chat-media__open-arrow ${
                    pictureDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </div>
              </button>
              {pictureDisplayed && <PhotoList observeIntersection={observeIntersection} rootRef={rootRef} />}
            </div>
          )}
          {videoAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <button
                onClick={changeVideoDisplayedState}
                type="button"
                className="chat-media__media-heading">
                <VideoSvg />
                <div className="chat-media__media-title">
                  {t('chatMedia.video', { count: videoAttachmentsCount })}
                </div>
                <div
                  className={`chat-media__open-arrow ${
                    videoDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </div>
              </button>
              {videoDisplayed && <VideoList rootRef={rootRef} />}
            </div>
          )}
          {audioAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <button
                onClick={changeAudioDisplayedState}
                type="button"
                className="chat-media__media-heading">
                <AudioSvg />
                <div className="chat-media__media-title">
                  {t('chatMedia.audio', { count: audioAttachmentsCount })}
                </div>
                <div
                  className={`chat-media__open-arrow ${
                    audioDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </div>
              </button>
              {audioDisplayed && <AudioList rootRef={rootRef} />}
            </div>
          )}
          {voiceAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <button
                onClick={changeVoiceDisplayedState}
                type="button"
                className="chat-media__media-heading">
                <VoiceSvg />
                <div className="chat-media__media-title">
                  {t('chatMedia.voice', { count: voiceAttachmentsCount })}
                </div>
                <div
                  className={`chat-media__open-arrow ${
                    voiceDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </div>
              </button>
              {voiceDisplayed && <RecordingsList rootRef={rootRef} />}
            </div>
          )}
          {filesAttachmentsCount > 0 && (
            <div className="chat-media__media-group">
              <button
                onClick={changeFilesDisplayedState}
                type="button"
                className="chat-media__media-heading">
                <FilesSvg />
                <div className="chat-media__media-title">
                  {t('chatMedia.file', { count: filesAttachmentsCount })}
                </div>
                <div
                  className={`chat-media__open-arrow ${
                    filesDisplayed ? 'chat-media__open-arrow--rotated' : ''
                  }`}>
                  <OpenArrowSvg />
                </div>
              </button>
              {filesDisplayed && <FileList rootRef={rootRef} />}
            </div>
          )}
        </div>
      )}
    </>
  );
};
