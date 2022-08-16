import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { IAttachmentToSend } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';

import { MediaAttachment } from '../media-attachment/media-attachment';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './media-grid.scss';

interface IMediaGridProps {
  media: (INamedAttachment | IAttachmentToSend)[];
  observeIntersection: ObserveFn;
}

const MediaGrid: React.FC<IMediaGridProps> = ({ media, observeIntersection }) => {
  const mediaListRef = useRef<null | (INamedAttachment | IAttachmentToSend)[]>(null);

  const isAttachmentsProgressEquals = useCallback((attachment, index) => {
    const attachmentRef = mediaListRef.current && mediaListRef.current[index];
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

  const isAttachmentsUrlEquals = useCallback((attachment, index) => {
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
    if (!mediaListRef.current) {
      mediaListRef.current = media;
      return;
    }

    if (media.some((attch, i) => attch.byteSize !== mediaListRef.current?.[i]?.byteSize)) {
      mediaListRef.current = media;
      return;
    }

    if (media.some(isAttachmentsUrlEquals) || media.some(isAttachmentsProgressEquals)) {
      mediaListRef.current = mediaListRef.current.map((attachment, i) => ({
        ...attachment,
        progress: (media[i] as IAttachmentToSend).progress,
        url: (media[i] as INamedAttachment).url,
      }));
    }
  }, [isAttachmentsProgressEquals, isAttachmentsUrlEquals, media]);

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
