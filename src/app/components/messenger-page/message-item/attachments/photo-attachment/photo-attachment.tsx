import React, { useCallback, useState } from 'react';
import './photo-attachment.scss';

import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import BigPhoto from '../../../shared/big-photo/big-photo';
import { PictureAttachment } from 'app/store/chats/models';

namespace PhotoAttachment {
	export interface Props {
		attachment: PictureAttachment;
	}
}

const PhotoAttachment = ({ attachment }: PhotoAttachment.Props) => {
	const [bigPhotoDisplayed, setBigPhotoDisplayed] = useState(false);
	const changeBigPhotoDisplayed = useCallback(() => setBigPhotoDisplayed((oldState) => !oldState), [
		setBigPhotoDisplayed,
	]);

	return (
		<>
			<div onClick={changeBigPhotoDisplayed} className='photo-attachment'>
				<img src={attachment.previewUrl} alt='' className='photo-attachment__img' />
			</div>
			<FadeAnimationWrapper isDisplayed={bigPhotoDisplayed}>
				<BigPhoto url={attachment.url} onClose={changeBigPhotoDisplayed} />
			</FadeAnimationWrapper>
		</>
	);
};

export default PhotoAttachment;
