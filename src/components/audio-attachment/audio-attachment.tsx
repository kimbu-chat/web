import React, { useCallback, useMemo } from 'react';

import { CircleProgressPreloader } from '@components/circle-progress-preloader/circle-progress-preloader';
import { AttachmentToSendType } from '@components/message-item/utilities';
import { AudioContext, CurrentAudio } from '@contexts/audioContext';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as PauseSvg } from '@icons/pause.svg';
import { ReactComponent as PlaySvg } from '@icons/play.svg';
import { removeAttachmentAction } from '@store/chats/actions';
import { getMinutesSeconds } from '@utils/date-utils';
import { getRawAttachmentSizeUnit } from '@utils/get-file-size-unit';

import type { IAudioAttachment } from 'kimbu-models';

import './audio-attachment.scss';

const BLOCK_NAME = 'audio-attachment';

const isAudioAttachment = (properties: MessageAudioAttachmentProps): properties is IAudioAttachment => 'url' in properties;

/* ------------- Types ------------- */
type CommonPropsType = { messageId?: number };

type AudioAttachmentPropsType = IAudioAttachment & CommonPropsType;

type AttachmentToSendPropsType = AttachmentToSendType & CommonPropsType;

type MessageAudioAttachmentProps = AudioAttachmentPropsType | AttachmentToSendPropsType;

/* ------------- Component ------------- */
export const MessageAudioAttachment: React.FC<MessageAudioAttachmentProps> = (props) => {
  const { id, fileName, byteSize, messageId } = props;

  const removeAttachment = useActionWithDispatch(removeAttachmentAction);

  const { duration } = useMemo(() => {
    if (isAudioAttachment(props)) {
      return { ...props };
    }
    return { duration: undefined };
  }, [props]);

  const { success, uploadedBytes } = useMemo(() => {
    if (!isAudioAttachment(props)) {
      return { ...props };
    }
    return { success: undefined, uploadedBytes: undefined };
  }, [props]);

  const cancelUploading = useCallback(() => {
    if (messageId) {
      removeAttachment({ attachmentId: id, messageId });
    }
  }, [id, messageId, removeAttachment]);

  const handlePlayerClick = useCallback(
    (currentAudio?: CurrentAudio, changeAudio?: (audioId: number) => void, toggleAudio?: () => void) => {
      const isCurrentAudio = currentAudio?.audioId === id;

      const changeCurrentAudio = () => {
        if (changeAudio) {
          changeAudio(id);
        }
      };

      return isCurrentAudio ? toggleAudio : changeCurrentAudio;
    },
    [id],
  );

  return (
    <AudioContext.Consumer>
      {({ toggleAudio, currentAudio, isPlayingAudio, changeAudio }) => (
        <div className={BLOCK_NAME}>
          <button
            onClick={success === false && uploadedBytes ? cancelUploading : handlePlayerClick(currentAudio, changeAudio, toggleAudio)}
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
