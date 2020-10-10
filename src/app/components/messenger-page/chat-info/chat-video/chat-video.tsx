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
