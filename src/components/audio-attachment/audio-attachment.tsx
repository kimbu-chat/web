import React, { useMemo } from 'react';

import { CircleProgressPreloader } from '@components/circle-progress-preloader/circle-progress-preloader';
import { AttachmentToSendType } from '@components/message-item/utilities';
import { AudioContext } from '@contexts/audioContext';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { getMinutesSeconds } from '@utils/date-utils';
import { getRawAttachmentSizeUnit } from '@utils/get-file-size-unit';

import type { IAudioAttachment } from 'kimbu-models';

import './audio-attachment.scss';

const BLOCK_NAME = 'audio-attachment';

type MessageAudioAttachmentProps = IAudioAttachment | AttachmentToSendType;

const isAudioAttachment = (properties: MessageAudioAttachmentProps): properties is IAudioAttachment => 'url' in properties;

export const MessageAudioAttachment: React.FC<MessageAudioAttachmentProps> = (props) => {
  const { id, fileName, byteSize } = props;

  const { duration } = useMemo(() => {
    if (isAudioAttachment(props)) {
      return { ...(props as IAudioAttachment) };
    }
    return { duration: undefined };
  }, [props]);

  const { success, uploadedBytes } = useMemo(() => {
    if (!isAudioAttachment(props)) {
      return { ...(props as AttachmentToSendType) };
    }
    return { success: undefined, uploadedBytes: undefined };
  }, [props]);

  return (
    <AudioContext.Consumer>
      {({ toggleAudio, currentAudio, isPlayingAudio, changeAudio }) => (
        <div className={BLOCK_NAME}>
          <button
            onClick={
              currentAudio?.audioId === id
                ? toggleAudio
                : () => {
                    if (changeAudio) {
                      changeAudio(id);
                    }
                  }
            }
            type="button"
            className={`${BLOCK_NAME}__download`}>
            {success === false && uploadedBytes && <CircleProgressPreloader byteSize={byteSize} uploadedBytes={uploadedBytes} />}
            {(success === undefined || success === true) && (isPlayingAudio && currentAudio?.audioId === id ? <PauseSvg /> : <PlaySvg />)}
          </button>
          <div className={`${BLOCK_NAME}__play-data`}>
            <div className={`${BLOCK_NAME}__data`}>
              <h4 className={`${BLOCK_NAME}__file-name`}>{fileName}</h4>
              <div className={`${BLOCK_NAME}__duration`}>
                {success === false && `${getRawAttachmentSizeUnit(uploadedBytes || byteSize)}/${getRawAttachmentSizeUnit(byteSize)}`}
                {(success === undefined || success === true) && duration && getMinutesSeconds(duration)}
              </div>
            </div>
          </div>
        </div>
      )}
    </AudioContext.Consumer>
  );
};
