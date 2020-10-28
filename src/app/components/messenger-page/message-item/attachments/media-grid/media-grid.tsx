import { FileBase, FileType, VideoBase } from 'app/store/messages/models';
import React from 'react';
import PhotoAttachment from '../photo-attachment/photo-attachment';
import VideoAttachment from '../video-attachment/video-attachment';
import './media-grid.scss';

namespace MediaGrid {
	export interface Props {
		media: (FileBase | VideoBase)[];
	}
}

const MediaGrid: React.FC<MediaGrid.Props> = ({ media }) => {
	return (
		<div className={`media-grid media-grid--${media.length}`}>
			{media.map((media) => {
				if (media.type === FileType.photo) {
					return <PhotoAttachment key={media.id} attachment={media} />;
				} else {
					return <VideoAttachment key={media.id} attachment={media as VideoBase} />;
				}
			})}
		</div>
	);
};

export default MediaGrid;
