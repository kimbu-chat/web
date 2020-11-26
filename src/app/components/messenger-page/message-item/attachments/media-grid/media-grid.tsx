import { PictureAttachment, VideoAttachment } from 'store/chats/models';
import { FileType } from 'store/messages/models';
import React from 'react';
import { MessagePhotoAttachment } from '../photo-attachment/photo-attachment';
import { MessageVideoAttachment } from '../video-attachment/video-attachment';
import './media-grid.scss';

namespace MediaGrid {
	export interface Props {
		media: (PictureAttachment | VideoAttachment)[];
	}
}

export const MediaGrid: React.FC<MediaGrid.Props> = React.memo(({ media }) => {
	return (
		<div className={`media-grid media-grid--${media.length === 1 ? 1 : media.length % 2 === 1 ? 'odd' : 'even'}`}>
			{media.map((media) => {
				if (media.type === FileType.picture) {
					return <MessagePhotoAttachment key={media.id} attachment={media as PictureAttachment} />;
				} else {
					return <MessageVideoAttachment key={media.id} attachment={media as VideoAttachment} />;
				}
			})}
		</div>
	);
});
