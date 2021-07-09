import React from 'react';

import { IPictureAttachment, IVideoAttachment } from '@store/chats/models';

import { MessageMediaAttachment } from '../media-attachment/media-attachment';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './media-grid.scss';

interface IMediaGridProps {
  media: (IPictureAttachment | IVideoAttachment)[];
  observeIntersection: ObserveFn;
}

const MediaGrid: React.FC<IMediaGridProps> = ({ media, observeIntersection }) => (
  <div className={`media-grid ${media.length === 1 ? 'media-grid--1' : ''}`}>
    {media.map((mediaElement) => (
      <MessageMediaAttachment
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
