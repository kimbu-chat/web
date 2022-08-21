import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { IAttachmentToSend } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';

import { MediaAttachment } from '../media-attachment/media-attachment';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './media-grid.scss';

interface IMediaGridProps {
  media: (INamedAttachment | IAttachmentToSend)[];
  observeIntersection: ObserveFn;
  messageId?: number;
}

const MediaGrid: React.FC<IMediaGridProps> = ({ media, observeIntersection, messageId }) => {
  const mediaListRef = useRef<null | (INamedAttachment | IAttachmentToSend)[]>(null);

  const isAttachmentsProgressNotEquals = useCallback((attachment: INamedAttachment | IAttachmentToSend, index: number) => {
    const attachmentRef: INamedAttachment | IAttachmentToSend | null = mediaListRef.current && mediaListRef.current[index];
    let attachmentProgress;
    let attachmentRefProgress;

    if ('progress' in attachment) {
      attachmentProgress = attachment.progress;
    }
    if (attachmentRef && 'progress' in attachmentRef) {
      attachmentRefProgress = attachmentRef.progress;
    }

    return attachmentProgress !== attachmentRefProgress;
  }, []);

  const isAttachmentsUrlNotEquals = useCallback((attachment: INamedAttachment | IAttachmentToSend, index: number) => {
    const attachmentRef = mediaListRef.current && mediaListRef.current[index];
    let attachmentUrl;
    let attachmentRefUrl;

    if ('url' in attachment) {
      attachmentUrl = attachment.url;
    }
    if (attachmentRef && 'url' in attachmentRef) {
      attachmentRefUrl = attachmentRef.url;
    }

    return attachmentUrl !== attachmentRefUrl;
  }, []);

  useEffect(() => {
    if (mediaListRef.current?.length !== media.length) {
      mediaListRef.current = media;
      return;
    }

    if (media.some((attch, i) => attch.byteSize !== mediaListRef.current?.[i]?.byteSize)) {
      mediaListRef.current = media;
      return;
    }

    if (media.some(isAttachmentsUrlNotEquals) || media.some(isAttachmentsProgressNotEquals)) {
      mediaListRef.current = mediaListRef.current.map((attachment, i) => ({
        ...attachment,
        uploadedBytes: (media[i] as IAttachmentToSend).uploadedBytes,
        byteSize: (media[i] as IAttachmentToSend).byteSize,
        success: (media[i] as IAttachmentToSend).success,
        progress: (media[i] as IAttachmentToSend).progress,
        url: (media[i] as INamedAttachment).url,
      }));
    }
  }, [isAttachmentsProgressNotEquals, isAttachmentsUrlNotEquals, media]);

  const mediaList = useMemo(() => {
    if (!mediaListRef.current) {
      return media;
    }

    return mediaListRef.current;
  }, [media]);

  return (
    <div className={`media-grid ${media.length === 1 ? 'media-grid--1' : ''}`}>
      {mediaList.map((mediaElement) => (
        <MediaAttachment
          messageId={messageId}
          observeIntersection={observeIntersection}
          key={mediaElement.id}
          attachmentId={mediaElement.id}
          attachmentsArr={mediaList}
        />
      ))}
    </div>
  );
};

MediaGrid.displayName = 'MediaGrid';

export { MediaGrid };
