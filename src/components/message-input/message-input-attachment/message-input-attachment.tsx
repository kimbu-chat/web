import React, { useCallback, useEffect, useState } from 'react';

import {
  AttachmentType,
  IAttachmentBase,
  IPictureAttachment,
  IVideoAttachment,
} from 'kimbu-models';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as CloseSVG } from '@icons/close-x.svg';
import { ReactComponent as FileSVG } from '@icons/file.svg';
import { ReactComponent as PhotoSVG } from '@icons/picture.svg';
import { ReactComponent as PlaySVG } from '@icons/play.svg';
import { ReactComponent as VideoSVG } from '@icons/video.svg';
import { ReactComponent as MicrophoneSvg } from '@icons/voice.svg';
import { removeAttachmentAction } from '@store/chats/actions';
import { IAttachmentToSend, IAttachmentCreation } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';
import { getRawAttachmentSizeUnit } from '@utils/get-file-size-unit';

import './message-input-attachment.scss';

interface IMessageInputAttachmentProps {
  attachment: IAttachmentToSend<IAttachmentBase>;
  isFromEdit?: boolean;
  removeSelectedAttachment?: (attachmentToRemove: IAttachmentCreation) => void;
}

export const MessageInputAttachment: React.FC<IMessageInputAttachmentProps> = ({
  attachment,
  isFromEdit,
  removeSelectedAttachment,
}) => {
  const removeAttachment = useActionWithDispatch(removeAttachmentAction);

  const [previewUrl, setPreviewUr] = useState<string>('');

  const removeThisAttachment = useCallback(() => {
    if (removeSelectedAttachment) {
      removeSelectedAttachment({
        type: attachment.attachment.type,
        id: attachment.attachment.id,
      });
    } else {
      removeAttachment({
        attachmentId: attachment.attachment.id,
      });
    }
  }, [
    attachment.attachment.id,
    attachment.attachment.type,
    removeAttachment,
    removeSelectedAttachment,
  ]);

  useEffect(() => {
    if (attachment.attachment.type === AttachmentType.Picture && !isFromEdit) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreviewUr(e.target?.result as string);
      };

      reader.readAsDataURL(attachment.file);
    }
  }, [setPreviewUr, isFromEdit, attachment.attachment.type, attachment.file]);

  return (
    <div className="message-input-attachment">
      {attachment.attachment.type === AttachmentType.Raw && (
        <FileSVG className="message-input-attachment__type-icon" />
      )}
      {attachment.attachment.type === AttachmentType.Video && (
        <>
          {(attachment.attachment as IVideoAttachment).firstFrameUrl && (
            <img
              src={(attachment.attachment as IVideoAttachment).firstFrameUrl}
              alt=""
              className="message-input-attachment__bg"
            />
          )}
          <VideoSVG className="message-input-attachment__type-icon" />
        </>
      )}
      {attachment.attachment.type === AttachmentType.Picture && (
        <>
          {((attachment.attachment as IPictureAttachment).previewUrl || previewUrl) && (
            <img
              src={(attachment.attachment as IPictureAttachment).previewUrl || previewUrl}
              alt=""
              className="message-input-attachment__bg"
            />
          )}
          <PhotoSVG className="message-input-attachment__type-icon" />
        </>
      )}
      {attachment.attachment.type === AttachmentType.Audio && (
        <PlaySVG className="message-input-attachment__type-icon" />
      )}

      {attachment.attachment.type === AttachmentType.Voice && (
        <MicrophoneSvg className="message-input-attachment__type-icon" />
      )}

      <div
        style={{ width: `${attachment.progress}%` }}
        className={`message-input-attachment__progress ${
          attachment.attachment.type === AttachmentType.Picture ||
          attachment.attachment.type === AttachmentType.Video
            ? 'message-input-attachment__progress--photo'
            : ''
        }`}
      />

      <div className="message-input-attachment__data">
        <div className="message-input-attachment__title">
          {(attachment.attachment as INamedAttachment).fileName}
        </div>
        <div className="message-input-attachment__size">{`${getRawAttachmentSizeUnit(
          attachment.uploadedBytes || attachment.attachment.byteSize,
        )}/${getRawAttachmentSizeUnit(attachment.attachment.byteSize)}}`}</div>
      </div>

      <button
        type="button"
        onClick={removeThisAttachment}
        className="message-input-attachment__close">
        <CloseSVG />
      </button>
    </div>
  );
};
