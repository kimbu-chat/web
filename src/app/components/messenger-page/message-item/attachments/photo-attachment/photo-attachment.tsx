import React, { useCallback, useState } from 'react';
import './photo-attachment.scss';

import { FileBase } from 'app/store/messages/models';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import BigPhoto from './big-photo/big-photo';

namespace PhotoAttachment {
	export interface Props {
		attachment: FileBase;
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
				<img src={attachment.url} alt='' className='photo-attachment__img' />
			</div>
			<FadeAnimationWrapper isDisplayed={bigPhotoDisplayed}>
				<BigPhoto url={attachment.url} onClose={changeBigPhotoDisplayed} />
			</FadeAnimationWrapper>
		</>
	);
};

export default PhotoAttachment;
