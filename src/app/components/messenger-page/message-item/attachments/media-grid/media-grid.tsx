import { FileType, IPictureAttachment, IVideoAttachment } from 'store/chats/models';
import React from 'react';
import { MessagePhotoAttachment } from '../photo-attachment/photo-attachment';
import { MessageVideoAttachment } from '../video-attachment/video-attachment';
import './media-grid.scss';

namespace MediaGridNS {
  export interface IProps {
    media: (IPictureAttachment | IVideoAttachment)[];
  }
}

export const MediaGrid: React.FC<MediaGridNS.IProps> = React.memo(({ media }) => (
  <div className={`media-grid media-grid--${media.length === 1 ? 1 : media.length % 2 === 1 ? 'odd' : 'even'}`}>
    {media.map((media) => {
      if (media.type === FileType.Picture) {
        return <MessagePhotoAttachment key={media.id} attachment={media as IPictureAttachment} />;
      }
      return <MessageVideoAttachment key={media.id} attachment={media as IVideoAttachment} />;
    })}
  </div>
));
