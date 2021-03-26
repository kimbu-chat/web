import {
  FileType,
  IAttachmentCreation,
  IAttachmentToSend,
  IBaseAttachment,
  IPictureAttachment,
  IRawAttachment,
  IVideoAttachment,
} from '@store/chats/models';
import React, { useCallback, useEffect, useState } from 'react';
import './message-input-attachment.scss';

import PhotoSVG from '@icons/picture.svg';
import VideoSVG from '@icons/video.svg';
import FileSVG from '@icons/file.svg';
import CloseSVG from '@icons/close-x.svg';
import PlaySVG from '@icons/play.svg';
import * as ChatActions from '@store/chats/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getRawAttachmentSizeUnit } from '@utils/get-file-size-unit';

interface IMessageInputAttachmentProps {
  attachment: IAttachmentToSend<IBaseAttachment>;
  isFromEdit?: boolean;
  removeSelectedAttachment?: (attachmentToRemove: IAttachmentCreation) => void;
}

export const MessageInputAttachment: React.FC<IMessageInputAttachmentProps> = React.memo(
  ({ attachment, isFromEdit, removeSelectedAttachment }) => {
    const removeAttachment = useActionWithDispatch(ChatActions.removeAttachmentAction);

    const [previewUrl, setPreviewUr] = useState<string>('');

    const removeThisAttachment = useCallback(() => {
      if (removeSelectedAttachment) {
        removeSelectedAttachment({
          type: attachment.attachment.type,
          id: attachment.attachment.id,
        });
      }

      removeAttachment({
        attachmentId: attachment.attachment.id,
      });
    }, [attachment.attachment.id]);

    useEffect(() => {
      if (attachment.attachment.type === FileType.Picture && !isFromEdit) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setPreviewUr(e.target?.result as string);
        };

        reader.readAsDataURL(attachment.file);
      }
    }, [setPreviewUr, isFromEdit]);

    return (
      <div className="message-input-attachment">
        {attachment.attachment.type === FileType.Raw && <FileSVG className="message-input-attachment__type-icon" viewBox="0 0 24 24" />}
        {attachment.attachment.type === FileType.Video && (
          <>
            {(attachment.attachment as IVideoAttachment).firstFrameUrl && (
              <img src={(attachment.attachment as IVideoAttachment).firstFrameUrl} alt="" className="message-input-attachment__bg" />
            )}
            <VideoSVG className="message-input-attachment__type-icon" viewBox="0 0 18 19" />
          </>
        )}
        {attachment.attachment.type === FileType.Picture && (
          <>
            {((attachment.attachment as IPictureAttachment).previewUrl || previewUrl) && (
              <img
                src={(attachment.attachment as IPictureAttachment).previewUrl || previewUrl}
                alt=""
                className="message-input-attachment__bg"
              />
            )}
            <PhotoSVG className="message-input-attachment__type-icon" viewBox="0 0 18 19" />
          </>
        )}
        {attachment.attachment.type === FileType.Audio && <PlaySVG className="message-input-attachment__type-icon" viewBox="0 0 24 24" />}

        <div
          style={{ width: `${attachment.progress}%` }}
          className={`message-input-attachment__progress ${
            attachment.attachment.type === FileType.Picture || attachment.attachment.type === FileType.Video
              ? 'message-input-attachment__progress--photo'
              : ''
          }`}
        />

        <div className="message-input-attachment__data">
          <div className="message-input-attachment__title">{attachment.fileName || (attachment.attachment as IRawAttachment).title}</div>
          <div className="message-input-attachment__size">
            {`${getRawAttachmentSizeUnit(attachment.uploadedBytes || attachment.attachment.byteSize)}/${getRawAttachmentSizeUnit(
              attachment.attachment.byteSize,
            )}}`}
          </div>
        </div>

        <button type="button" onClick={removeThisAttachment} className="message-input-attachment__close">
          <CloseSVG viewBox="0 0 8 8" />
        </button>
      </div>
    );
  },
);
