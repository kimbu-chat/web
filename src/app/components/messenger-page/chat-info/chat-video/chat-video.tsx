import React, { useCallback, useContext, useRef } from 'react';
import './chat-video.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';

import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { ChatActions } from 'app/store/chats/actions';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { Page } from 'app/store/common/models';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useLocation } from 'react-router-dom';
import VideoFromList from './video/video-from-list';
import { setSeparators } from 'app/utils/functions/set-separators';

namespace ChatVideo {
	export interface Video {
		id: string;
		previewImgUrl: string;
		creationDateTime: Date;
		duration: number;
		alt?: string;
		needToShowSeparator?: boolean;
	}
}

const ChatVideo = () => {
	const { t } = useContext(LocalizationContext);

	const videoContainerRef = useRef<HTMLDivElement>(null);

	const getVideos = useActionWithDispatch(ChatActions.getVideo);
	const selectedChat = useSelector(getSelectedChatSelector);
	const videosForSelectedDialog = selectedChat!.videos;

	const location = useLocation();

	const loadMore = useCallback(() => {
		console.log('call');
		const page: Page = {
			offset: videosForSelectedDialog?.videos!.length || 0,
			limit: 20,
		};

		console.log(page);

		getVideos({
			page,
			chatId: selectedChat!.id,
		});
	}, [selectedChat!.id, videosForSelectedDialog?.videos]);

	const videosWithSeparators = setSeparators(videosForSelectedDialog?.videos, 'month');

	return (
		<div className={'chat-video'}>
			<div className='chat-video__top'>
				<Link to={location.pathname.replace('/video', '')} className='chat-video__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</Link>
				<div className='chat-video__heading'>{t('chatVideo.video')}</div>
			</div>
			<div className='chat-video__video-container'>
				<InfiniteScroll
					pageStart={0}
					initialLoad={true}
					loadMore={loadMore}
					hasMore={videosForSelectedDialog.hasMore}
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
						<VideoFromList key={video.id} video={video} />
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default ChatVideo;
