import React, { useCallback, useContext, useRef } from 'react';
import './chat-video.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import moment from 'moment';

import PlaySvg from 'app/assets/icons/ic-play.svg';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { ChatActions } from 'app/store/chats/actions';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { Page } from 'app/store/common/models';
import InfiniteScroll from 'react-infinite-scroller';

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

	const videoContainerRef = useRef<HTMLDivElement>(null);

	const getVideos = useActionWithDispatch(ChatActions.getVideo);
	const selectedChat = useSelector(getSelectedChatSelector);
	const videoForSelectedDialog = selectedChat!.videos;

	const loadMore = useCallback(() => {
		console.log('call');
		const page: Page = {
			offset: videoForSelectedDialog?.videos!.length || 0,
			limit: 20,
		};

		console.log(page);

		getVideos({
			page,
			chatId: selectedChat!.id,
		});
	}, [selectedChat!.id, videoForSelectedDialog?.videos]);

	const videosWithSeparators = videoForSelectedDialog?.videos.map((elem, index, array) => {
		const elemCopy = { ...elem };
		if (
			index === 0 ||
			new Date(array[index - 1].creationDateTime).getMonth() !== new Date(elem.creationDateTime).getMonth()
		) {
			elemCopy.needToShowSeparator = true;
		}
		return elemCopy;
	});

	return (
		<div className={isDisplayed ? 'chat-video chat-video--active' : 'chat-video'}>
			<div className='chat-video__top'>
				<button onClick={close} className='chat-video__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</button>
				<div className='chat-video__heading'>{t('chatVideo.video')}</div>
			</div>
			<div className='chat-video__video-container'>
				<InfiniteScroll
					pageStart={0}
					initialLoad={true}
					loadMore={loadMore}
					hasMore={videoForSelectedDialog.hasMore}
					getScrollParent={() => videoContainerRef.current}
					loader={
						<div className='loader ' key={0}>
							<div className=''>
								<div className='lds-ellipsis'>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
						</div>
					}
					useWindow={false}
					isReverse={false}
				>
					{videosWithSeparators?.map((video) => (
						<React.Fragment key={video.id}>
							{video.needToShowSeparator && (
								<div className='chat-video__separator'>
									{moment(video.creationDateTime).format('MMMM')}
								</div>
							)}
							<div className='chat-video__video-wrapper'>
								<img className='chat-video__video' src={video.previewImgUrl} alt={video.alt} />
								<button className='chat-video__play'>
									<PlaySvg viewBox='0 0 25 25' />
									<span className='chat-video__duration'>
										{moment.utc(video.duration * 1000).format('mm:ss')}
									</span>
								</button>
							</div>{' '}
						</React.Fragment>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default ChatVideo;
