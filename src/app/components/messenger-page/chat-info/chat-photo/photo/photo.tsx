import BigPhoto from 'app/components/messenger-page/shared/big-photo/big-photo';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import { IGroupable, PictureAttachment } from 'app/store/chats/models';
import moment from 'moment';
import React, { useCallback, useState } from 'react';

namespace PhotoNS {
	export interface Props {
		photo: PictureAttachment & IGroupable;
	}
}

const Photo: React.FC<PhotoNS.Props> = ({ photo }) => {
	const [bigPhotoDisplayed, setBigPhotoDisplayed] = useState(false);
	const changeBigPhotoDisplayed = useCallback(() => setBigPhotoDisplayed((oldState) => !oldState), [
		setBigPhotoDisplayed,
	]);

	return (
		<>
			{photo.needToShowSeparator && (
				<div className='chat-photo__separator'>{moment(photo.creationDateTime).format('MMMM')}</div>
			)}
			<img onClick={changeBigPhotoDisplayed} key={photo.id} className='chat-photo__photo' src={photo.url} />
			<FadeAnimationWrapper isDisplayed={bigPhotoDisplayed}>
				<BigPhoto url={photo.url} onClose={changeBigPhotoDisplayed} />
			</FadeAnimationWrapper>
		</>
	);
};

export default Photo;
