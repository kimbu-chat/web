import { FileType, IAttachmentCreation, IAttachmentToSend, IBaseAttachment, IPictureAttachment, IRawAttachment, IVideoAttachment } from 'store/chats/models';
import React, { useCallback, useEffect, useState } from 'react';
import './message-input-attachment.scss';

import PhotoSVG from 'icons/ic-photo.svg';
import VideoSVG from 'icons/ic-video-call.svg';
import FileSVG from 'icons/ic-documents.svg';
import MicrophoneSVG from 'icons/ic-microphone.svg';
import PlaySVG from 'icons/ic-play.svg';
import CloseSVG from 'icons/ic-close.svg';
import { ChatActions } from 'store/chats/actions';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';

interface IMessageInputAttachmentProps {
  attachment: IAttachmentToSend<IBaseAttachment>;
  isFromEdit?: boolean;
  removeSelectedAttachment?: (attachmentToRemove: IAttachmentCreation) => void;
}

export const MessageInputAttachment: React.FC<IMessageInputAttachmentProps> = React.memo(({ attachment, isFromEdit, removeSelectedAttachment }) => {
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
    <div
      style={{
        backgroundColor: `${attachment.success ? 'rgba(50, 168, 82, 0.4)' : attachment.failure ? 'rgba(168, 50, 83, 0,4)' : ' rgba(63, 138, 224, 0.1)'}`,
      }}
      className='message-input-attachment'
    >
      <div className='message-input-attachment__icon'>
        {attachment.attachment.type === FileType.Raw && <FileSVG viewBox='0 0 25 25' />}
        {attachment.attachment.type === FileType.Video && (
          <>
            <img src={(attachment.attachment as IVideoAttachment).firstFrameUrl} alt='' className='message-input-attachment__bg' />
            <VideoSVG viewBox='0 0 25 25' />
          </>
        )}
        {attachment.attachment.type === FileType.Voice && <MicrophoneSVG viewBox='0 0 25 25' />}
        {attachment.attachment.type === FileType.Picture && (
          <>
            <img src={(attachment.attachment as IPictureAttachment).previewUrl || previewUrl} alt='' className='message-input-attachment__bg' />
            <PhotoSVG viewBox='0 0 25 25' />
          </>
        )}
        {attachment.attachment.type === FileType.Audio && <PlaySVG viewBox='0 0 25 25' />}
      </div>
      <div className='message-input-attachment__progress-container'>
        <div style={{ width: `${attachment.progress}%` }} className='message-input-attachment__progress' />
      </div>
      {(attachment.attachment.type === FileType.Audio || attachment.attachment.type === FileType.Raw) && (
        <div className='message-input-attachment__title'>{attachment.fileName || (attachment.attachment as IRawAttachment).title}</div>
      )}
      <button type='button' onClick={removeThisAttachment} className='message-input-attachment__close'>
        <CloseSVG viewBox='0 0 25 25' />
      </button>
    </div>
  );
});
