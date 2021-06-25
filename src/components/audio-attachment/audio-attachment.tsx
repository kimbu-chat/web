import React from 'react';
import dayjs from 'dayjs';

import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { AudioContext } from '@contexts/audioContext';
import { IAudioAttachment } from '@store/chats/models';

import './audio-attachment.scss';

const BLOCK_NAME = 'audio-attachment';

export const MessageAudioAttachment: React.FC<IAudioAttachment> = ({ ...attachment }) => (
  <AudioContext.Consumer>
    {({ toggleAudio, currentAudio, isPlayingAudio, changeAudio }) => (
      <div className={BLOCK_NAME}>
        <button
          onClick={
            currentAudio?.audioId === attachment.id
              ? toggleAudio
              : () => {
                  if (changeAudio) {
                    changeAudio(attachment.id);
                  }
                }
          }
          type="button"
          className={`${BLOCK_NAME}__download`}>
          {isPlayingAudio && currentAudio?.audioId === attachment.id ? (
            <PauseSvg viewBox="0 0 24 24" />
          ) : (
            <PlaySvg viewBox="0 0 24 24" />
          )}
        </button>
        <div className={`${BLOCK_NAME}__play-data`}>
          <div className={`${BLOCK_NAME}__data`}>
            <h4 className={`${BLOCK_NAME}__file-name`}>{attachment.fileName}</h4>
            <div className={`${BLOCK_NAME}__duration`}>
              {dayjs.utc(attachment.duration * 1000).format('mm:ss')}
            </div>
          </div>
        </div>
      </div>
    )}
  </AudioContext.Consumer>
);
