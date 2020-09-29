import React, { useContext } from 'react';
import './chat-photo.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import moment from 'moment';

namespace ChatPhoto {
	export interface Props {
		isDisplayed: boolean;
		close: () => void;
	}

	export interface Photo {
		id: string;
		url: string;
		creationDateTime: Date;
		alt?: string;
		needToShowSeparator?: boolean;
	}
}

const ChatPhoto = ({ isDisplayed, close }: ChatPhoto.Props) => {
	const { t } = useContext(LocalizationContext);

	//TODO: when endpoint will be done replace with useSelector
	const photoToDisplay: ChatPhoto.Photo[] = [
		{
			id: 'aa',
			url: 'https://i.imgur.com/t0x900S.jpg',
			creationDateTime: new Date('January 17, 2020 03:24:00'),
		},
		{
			id: 'ab',
			url: 'https://i.imgur.com/LonSqFi.png',
			creationDateTime: new Date('January 17, 2020 03:24:00'),
		},
		{
			id: 'ac',
			url: 'https://i.imgur.com/FklkvSE.jpg',
			creationDateTime: new Date('January 17, 2020 03:24:00'),
		},
		{ id: 'ad', url: 'https://i.imgur.com/lbLmdpg.jpg', creationDateTime: new Date('January 17, 2020 03:24:00') },
		{
			id: 'ae',
			url: 'https://i.imgur.com/ZtRulbn.jpg',
			creationDateTime: new Date('January 17, 2020 03:24:00'),
		},
		{
			id: 'af',
			url: 'https://i.imgur.com/YD0MOmZ.jpg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
		},
		{
			id: 'ag',
			url: 'https://i.imgur.com/6CZ2LLB.jpeg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
		},
		{
			id: 'ah',
			url: 'https://i.imgur.com/HNLMF0P.jpg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
		},
		{
			id: 'ak',
			url: 'https://i.imgur.com/0vb5W9m.jpg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
		},
		{
			id: 'al',
			url: 'https://i.imgur.com/r3inDL8.jpg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
		},
		{
			id: 'am',
			url: 'https://i.imgur.com/u0TXr08.jpeg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
		},
		{
			id: 'an',
			url: 'https://i.imgur.com/N325EqP.jpg',
			creationDateTime: new Date('June 17, 2020 03:24:00'),
		},
		{
			id: 'ap',
			url: 'https://i.imgur.com/zpmoEhg.jpg',
			creationDateTime: new Date('June 17, 2020 03:24:00'),
		},
	];

	const photosWithSeparators = photoToDisplay.reduce((prevValue, currentValue, currentIndex, array) => {
		if (
			currentIndex === 0 ||
			new Date(array[currentIndex - 1].creationDateTime).getMonth() !==
				new Date(currentValue.creationDateTime).getMonth()
		) {
			prevValue.push([currentValue]);
		} else {
			prevValue[prevValue.length - 1].push(currentValue);
		}

		return prevValue;
	}, [] as ChatPhoto.Photo[][]);

	return (
		<div className={isDisplayed ? 'chat-photo chat-photo--active' : 'chat-photo'}>
			<div className='chat-photo__top'>
				<button onClick={close} className='chat-photo__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</button>
				<div className='chat-photo__heading'>{t('chatPhoto.photo')}</div>
			</div>
			{photosWithSeparators.map((photoGroup) => (
				<React.Fragment key={photoGroup[0].id + 'group'}>
					<div className='chat-photo__separator'>{moment(photoGroup[0].creationDateTime).format('MMMM')}</div>
					<div className='chat-photo__photo-list'>
						{photoGroup.map((photo) => (
							<img key={photo.id} className='chat-photo__photo' src={photo.url} alt={photo.alt} />
						))}
					</div>
				</React.Fragment>
			))}
		</div>
	);
};

export default ChatPhoto;
