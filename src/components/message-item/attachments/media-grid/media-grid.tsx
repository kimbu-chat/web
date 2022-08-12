import React, { useEffect, useMemo, useRef } from 'react';

import { IAttachmentToSend } from '@store/chats/models';
import { INamedAttachment } from '@store/chats/models/named-attachment';

import { MediaAttachment } from '../media-attachment/media-attachment';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './media-grid.scss';

interface IMediaGridProps {
  media: INamedAttachment[];
  observeIntersection: ObserveFn;
}

const MediaGrid: React.FC<IMediaGridProps> = ({ media, observeIntersection }) => {
  const mediaListRef = useRef<INamedAttachment[] | null>(null);

  useEffect(() => {
    if (!mediaListRef.current) {
      mediaListRef.current = media;
      return;
    }

    if (media.some((attch, i) => attch.byteSize !== mediaListRef.current?.[i]?.byteSize)) {
      mediaListRef.current = media;
      return;
    }

    if (
      media.some((attch, i) => {
        const { progress: mediaProgress } = attch as unknown as IAttachmentToSend;
        const { progress: mediaRefProgress } = mediaListRef.current?.[
          i
        ] as unknown as IAttachmentToSend;

        return mediaProgress !== mediaRefProgress || attch.url !== mediaListRef.current?.[i]?.url;
      })
    ) {
      mediaListRef.current = mediaListRef.current.map((attach, i) => ({
        ...attach,
        progress: (media[i] as unknown as IAttachmentToSend)?.progress,
        url: media[i].url,
      }));
    }
  }, [media]);

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
