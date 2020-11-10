import React, { useCallback, useContext, useRef } from 'react';
import './chat-photo.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { ChatActions } from 'app/store/chats/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { Page } from 'app/store/common/models';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useLocation } from 'react-router-dom';
import Photo from './photo/photo';
import { setSeparators } from 'app/utils/functions/set-separators';

const ChatPhoto = () => {
	const { t } = useContext(LocalizationContext);

	const photoContainerRef = useRef<HTMLDivElement>(null);

	const getPhotos = useActionWithDispatch(ChatActions.getPhoto);
	const selectedChat = useSelector(getSelectedChatSelector);
	const photoForSelectedDialog = selectedChat!.photos;

	const location = useLocation();

	const loadMore = useCallback(() => {
		console.log('call');
		const page: Page = {
			offset: photoForSelectedDialog?.photos!.length || 0,
			limit: 20,
		};

		console.log(page);

		getPhotos({
			page,
			chatId: selectedChat!.id,
		});
	}, [selectedChat!.id, photoForSelectedDialog?.photos]);

	const photosWithSeparators = setSeparators(photoForSelectedDialog?.photos, 'month', true);

	return (
		<div className={'chat-photo'}>
			<div className='chat-photo__top'>
				<Link to={location.pathname.replace('/photo', '')} className='chat-photo__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</Link>
				<div className='chat-photo__heading'>{t('chatPhoto.photo')}</div>
			</div>
			<div ref={photoContainerRef} className='chat-photo__photo-container'>
				<InfiniteScroll
					pageStart={0}
					initialLoad={true}
					loadMore={loadMore}
					hasMore={photoForSelectedDialog.hasMore}
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
};

export default ChatPhoto;
