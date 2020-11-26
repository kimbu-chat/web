import React, { useCallback, useContext, useRef } from 'react';
import './chat-photo.scss';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { ChatActions } from 'store/chats/actions';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { Page } from 'store/common/models';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useLocation } from 'react-router-dom';
import { Photo } from './photo/photo';
import { setSeparators } from 'utils/functions/set-separators';

export const ChatPhoto = React.memo(() => {
	const { t } = useContext(LocalizationContext);

	const photoContainerRef = useRef<HTMLDivElement>(null);

	const getPhotoAttachmentss = useActionWithDispatch(ChatActions.getPhotoAttachments);
	const selectedChat = useSelector(getSelectedChatSelector);
	const photoForSelectedChat = selectedChat!.photos;

	const location = useLocation();

	const loadMore = useCallback(() => {
		const page: Page = {
			offset: photoForSelectedChat?.photos!.length || 0,
			limit: 20,
		};

		getPhotoAttachmentss({
			page,
			chatId: selectedChat!.id,
		});
	}, [selectedChat!.id, photoForSelectedChat?.photos]);

	const photosWithSeparators = setSeparators(
		photoForSelectedChat?.photos,
		{ separateByMonth: true, separateByYear: true },
		{ separateByMonth: true, separateByYear: true },
	);

	return (
		<div className={'chat-photo'}>
			<div className='chat-photo__top'>
				<Link to={location.pathname.replace(/photo\/?/, '')} className='chat-photo__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</Link>
				<div className='chat-photo__heading'>{t('chatPhoto.photo')}</div>
			</div>
			<div ref={photoContainerRef} className='chat-photo__photo-container'>
				<InfiniteScroll
					pageStart={0}
					initialLoad={true}
					loadMore={loadMore}
					hasMore={photoForSelectedChat.hasMore}
					getScrollParent={() => photoContainerRef.current}
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
					{photosWithSeparators?.map((photo) => (
						<Photo photo={photo} key={photo.id} />
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
});
