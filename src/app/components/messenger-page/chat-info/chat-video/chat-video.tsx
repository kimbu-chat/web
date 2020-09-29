import React, { useContext } from 'react';
import './chat-video.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import moment from 'moment';

import PlaySvg from 'app/assets/icons/ic-play.svg';

namespace ChatVideo {
	export interface Props {
		isDisplayed: boolean;
		close: () => void;
	}

	export interface Video {
		id: string;
		previewImgUrl: string;
		creationDateTime: Date;
		duration: number;
		alt?: string;
		needToShowSeparator?: boolean;
	}
}

const ChatVideo = ({ isDisplayed, close }: ChatVideo.Props) => {
	const { t } = useContext(LocalizationContext);

	//TODO: when endpoint will be done replace with useSelector
	const videoToDisplay: ChatVideo.Video[] = [
		{
			id: 'aa',
			previewImgUrl: 'https://i.imgur.com/t0x900S.jpg',
			creationDateTime: new Date('January 17, 2020 03:24:00'),
			duration: 120,
		},
		{
			id: 'ab',
			previewImgUrl: 'https://i.imgur.com/LonSqFi.png',
			creationDateTime: new Date('January 17, 2020 03:24:00'),
			duration: 118,
		},
		{
			id: 'ac',
			previewImgUrl: 'https://i.imgur.com/FklkvSE.jpg',
			creationDateTime: new Date('January 17, 2020 03:24:00'),
			duration: 192,
		},
		{
			id: 'ad',
			previewImgUrl: 'https://i.imgur.com/lbLmdpg.jpg',
			creationDateTime: new Date('January 17, 2020 03:24:00'),
			duration: 131,
		},
		{
			id: 'ae',
			previewImgUrl: 'https://i.imgur.com/ZtRulbn.jpg',
			creationDateTime: new Date('January 17, 2020 03:24:00'),
			duration: 1256,
		},
		{
			id: 'af',
			previewImgUrl: 'https://i.imgur.com/YD0MOmZ.jpg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
			duration: 2287,
		},
		{
			id: 'ag',
			previewImgUrl: 'https://i.imgur.com/6CZ2LLB.jpeg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
			duration: 287,
		},
		{
			id: 'ah',
			previewImgUrl: 'https://i.imgur.com/HNLMF0P.jpg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
			duration: 1687,
		},
		{
			id: 'ak',
			previewImgUrl: 'https://i.imgur.com/0vb5W9m.jpg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
			duration: 1023,
		},
		{
			id: 'al',
			previewImgUrl: 'https://i.imgur.com/r3inDL8.jpg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
			duration: 1753,
		},
		{
			id: 'am',
			previewImgUrl: 'https://i.imgur.com/u0TXr08.jpeg',
			creationDateTime: new Date('February 17, 2020 03:24:00'),
			duration: 12569,
		},
		{
			id: 'an',
			previewImgUrl: 'https://i.imgur.com/N325EqP.jpg',
			creationDateTime: new Date('June 17, 2020 03:24:00'),
			duration: 56,
		},
		{
			id: 'ap',
			previewImgUrl: 'https://i.imgur.com/zpmoEhg.jpg',
			creationDateTime: new Date('June 17, 2020 03:24:00'),
			duration: 1,
		},
	];

	const videosWithSeparators = videoToDisplay.reduce((prevValue, currentValue, currentIndex, array) => {
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
	}, [] as ChatVideo.Video[][]);

	return (
		<div className={isDisplayed ? 'chat-video chat-video--active' : 'chat-video'}>
			<div className='chat-video__top'>
				<button onClick={close} className='chat-video__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</button>
				<div className='chat-video__heading'>{t('chatVideo.video')}</div>
			</div>
			{videosWithSeparators.map((videoGroup) => (
				<React.Fragment key={videoGroup[0].id + 'group'}>
					<div className='chat-video__separator'>{moment(videoGroup[0].creationDateTime).format('MMMM')}</div>
					<div className='chat-video__video-list'>
						{videoGroup.map((video) => (
							<div key={video.id} className='chat-video__video-wrapper'>
								<img className='chat-video__video' src={video.previewImgUrl} alt={video.alt} />
								<button className='chat-video__play'>
									<PlaySvg viewBox='0 0 25 25' />
									<span className='chat-video__duration'>
										{moment.utc(video.duration * 1000).format('mm:ss')}
									</span>
								</button>
							</div>
						))}
					</div>
				</React.Fragment>
			))}
		</div>
	);
};

export default ChatVideo;
