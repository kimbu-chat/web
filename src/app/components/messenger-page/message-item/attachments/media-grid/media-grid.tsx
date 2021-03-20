import { IPictureAttachment, IVideoAttachment } from '@store/chats/models';
import React from 'react';
import './media-grid.scss';
import { MessageMediaAttachment } from '../media-attachment/media-attachment';

interface IMediaGridProps {
  media: (IPictureAttachment | IVideoAttachment)[];
}

export const MediaGrid: React.FC<IMediaGridProps> = React.memo(({ media }) => (
  <div className={`media-grid media-grid--${media.length === 1 ? 1 : media.length % 2 === 1 ? 'odd' : 'even'}`}>
    {media.map((mediaElement) => (
      <MessageMediaAttachment key={mediaElement.id} attachmentId={mediaElement.id} attachmentsArr={media} />
    ))}
  </div>
));
