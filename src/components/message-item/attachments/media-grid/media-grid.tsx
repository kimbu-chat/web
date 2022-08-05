import React from 'react';

import { INamedAttachment } from '@store/chats/models/named-attachment';

import { MediaAttachment } from '../media-attachment/media-attachment';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './media-grid.scss';

interface IMediaGridProps {
  media: INamedAttachment[];
  observeIntersection: ObserveFn;
}

const MediaGrid: React.FC<IMediaGridProps> = ({ media, observeIntersection }) => (
  <div className={`media-grid ${media.length === 1 ? 'media-grid--1' : ''}`}>
    {media.map((mediaElement) => (
      <MediaAttachment
        observeIntersection={observeIntersection}
        key={mediaElement.id}
        attachmentId={mediaElement.id}
        attachmentsArr={media}
      />
    ))}
  </div>
);

MediaGrid.displayName = 'MediaGrid';

export { MediaGrid };
