import { IPictureAttachment, IVideoAttachment } from '@store/chats/models';
import React from 'react';
import './media-grid.scss';
import { xorBy } from 'lodash';
import { MessageMediaAttachment } from '../media-attachment/media-attachment';

interface IMediaGridProps {
  media: (IPictureAttachment | IVideoAttachment)[];
}

const MediaGrid: React.FC<IMediaGridProps> = React.memo(
  ({ media }) => (
    <div className={`media-grid ${media.length === 1 ? 'media-grid--1' : ''}`}>
      {media.map((mediaElement) => (
        <MessageMediaAttachment
          key={mediaElement.id}
          attachmentId={mediaElement.id}
          attachmentsArr={media}
        />
      ))}
    </div>
  ),
  (prevProps, nextProps) => xorBy(prevProps.media, nextProps.media, 'id').length === 0,
);

MediaGrid.displayName = 'MediaGrid';

export { MediaGrid };
