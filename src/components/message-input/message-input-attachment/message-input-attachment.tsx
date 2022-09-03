import React, { useCallback, useEffect, useState } from 'react';

import { AttachmentType, IAttachmentBase, IPictureAttachment, IVideoAttachment } from 'kimbu-models';

import ProgressPreloader from '@components/progress-preloader/progress-preloader';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as CloseSVG } from '@icons/close-x.svg';
import { ReactComponent as FileSVG } from '@icons/file.svg';
import { ReactComponent as PhotoSVG } from '@icons/picture.svg';
import { ReactComponent as PlaySVG } from '@icons/play.svg';
import { ReactComponent as VideoSVG } from '@icons/video.svg';
import { ReactComponent as MicrophoneSvg } from '@icons/voice.svg';
import { removeAttachmentAction } from '@store/chats/actions';
import { IAttachmentCreation, IAttachmentToSend } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';

import './message-input-attachment.scss';

interface IMessageInputAttachmentProps {
  attachment: IAttachmentToSend | IAttachmentBase;
  isFromEdit?: boolean;
  removeSelectedAttachment?: (attachmentToRemove: IAttachmentCreation) => void;
}

export const MessageInputAttachment: React.FC<IMessageInputAttachmentProps> = ({ attachment, isFromEdit, removeSelectedAttachment }) => {
  const removeAttachment = useActionWithDispatch(removeAttachmentAction);
  const newAttachment = attachment as IAttachmentToSend;
  const [previewUrl, setPreviewUr] = useState<string>('');

  const removeThisAttachment = useCallback(() => {
    if (removeSelectedAttachment) {
      removeSelectedAttachment({
        type: attachment.type,
        id: attachment.id,
      });
    } else {
      removeAttachment({
        attachmentId: attachment.id,
      });
    }
  }, [attachment.id, attachment.type, removeAttachment, removeSelectedAttachment]);

  useEffect(() => {
    if (attachment.type === AttachmentType.Picture && !isFromEdit) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreviewUr(e.target?.result as string);
      };

      reader.readAsDataURL(newAttachment.file);
    }
  }, [setPreviewUr, isFromEdit, attachment.type, newAttachment.file]);

  return (
    <div className="message-input-attachment">
      {attachment.type === AttachmentType.Raw && <FileSVG className="message-input-attachment__type-icon" />}
      {attachment.type === AttachmentType.Video && (
        <>
          {(attachment as unknown as IVideoAttachment).firstFrameUrl && (
            <img src={(attachment as unknown as IVideoAttachment).firstFrameUrl} alt="" className="message-input-attachment__bg" />
          )}
          <VideoSVG className="message-input-attachment__type-icon" />
        </>
      )}
      {attachment.type === AttachmentType.Picture && (
        <>
          {((attachment as unknown as IPictureAttachment).previewUrl || previewUrl) && (
            <img src={(attachment as unknown as IPictureAttachment).previewUrl || previewUrl} alt="" className="message-input-attachment__bg" />
          )}
          <PhotoSVG className="message-input-attachment__type-icon" />
        </>
      )}
      {attachment.type === AttachmentType.Audio && <PlaySVG className="message-input-attachment__type-icon" />}

      {attachment.type === AttachmentType.Voice && <MicrophoneSvg className="message-input-attachment__type-icon" />}

      <ProgressPreloader
        progress={newAttachment.progress}
        type={attachment.type}
        fileName={(attachment as unknown as INamedAttachment).fileName}
        byteSize={attachment.byteSize}
        uploadedBytes={newAttachment.uploadedBytes}
      />

      <button type="button" onClick={removeThisAttachment} className="message-input-attachment__close">
        <CloseSVG />
      </button>
    </div>
  );
};
