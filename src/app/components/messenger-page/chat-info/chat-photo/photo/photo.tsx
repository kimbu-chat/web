import { BigPhoto, FadeAnimationWrapper } from 'components';
import { IGroupable, PictureAttachment } from 'store/chats/models';
import { doesYearDifferFromCurrent } from 'utils/functions/set-separators';
import moment from 'moment';
import React, { useCallback, useState } from 'react';

namespace PhotoNS {
	export interface Props {
		photo: PictureAttachment & IGroupable;
	}
}

export const Photo: React.FC<PhotoNS.Props> = React.memo(({ photo }) => {
	const [bigPhotoDisplayed, setBigPhotoDisplayed] = useState(false);
	const changeBigPhotoDisplayed = useCallback(() => setBigPhotoDisplayed((oldState) => !oldState), [
		setBigPhotoDisplayed,
	]);

	return (
		<>
			{photo.needToShowMonthSeparator && (
				<div className='chat-photo__separator'>
					{photo.needToShowMonthSeparator &&
						(photo.needToShowYearSeparator || doesYearDifferFromCurrent(photo.creationDateTime)
							? moment(photo.creationDateTime).format('MMMM YYYY')
							: moment(photo.creationDateTime).format('MMMM'))}
				</div>
			)}
			<img onClick={changeBigPhotoDisplayed} key={photo.id} className='chat-photo__photo' src={photo.url} />
			<FadeAnimationWrapper isDisplayed={bigPhotoDisplayed}>
				<BigPhoto url={photo.url} onClose={changeBigPhotoDisplayed} />
			</FadeAnimationWrapper>
		</>
	);
});
