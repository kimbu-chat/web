import React from 'react';
import './photo-attachment.scss';

import { FileBase } from 'app/store/messages/models';

namespace PhotoAttachment {
	export interface Props {
		attachment: FileBase;
	}
}

const PhotoAttachment = ({ attachment }: PhotoAttachment.Props) => {
	return (
		<div className='photo-attachment'>
			<img src={attachment.url} alt='' className='photo-attachment__img' />
		</div>
	);
};

export default PhotoAttachment;
