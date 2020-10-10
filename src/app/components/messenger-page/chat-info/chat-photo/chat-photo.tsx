import React, { useCallback, useContext, useRef } from 'react';
import './chat-photo.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import moment from 'moment';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { ChatActions } from 'app/store/chats/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { Page } from 'app/store/common/models';
import InfiniteScroll from 'react-infinite-scroller';

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

	const photoContainerRef = useRef<HTMLDivElement>(null);

	const getPhotos = useActionWithDispatch(ChatActions.getPhoto);
	const selectedChat = useSelector(getSelectedChatSelector);
	const photoForSelectedDialog = selectedChat!.photos;

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

	const photosWithSeparators =
		photoForSelectedDialog?.photos.reduce((prevValue, currentValue, currentIndex, array) => {
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
		}, [] as ChatPhoto.Photo[][]) || [];

	return (
		<div className={isDisplayed ? 'chat-photo chat-photo--active' : 'chat-photo'}>
			<div className='chat-photo__top'>
				<button onClick={close} className='chat-photo__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</button>
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
					{photosWithSeparators?.map((photoGroup) => (
						<React.Fragment
							key={
								String(new Date(photoGroup[0].creationDateTime).getUTCMonth()) +
								String(new Date(photoGroup[0].creationDateTime).getFullYear())
							}
						>
							<div className='chat-photo__separator'>
								{moment(photoGroup[0].creationDateTime).format('MMMM')}
							</div>
							<div className='chat-photo__photo-list'>
								{photoGroup.map((photo) => (
									<img key={photo.id} className='chat-photo__photo' src={photo.url} alt={photo.alt} />
								))}
							</div>
						</React.Fragment>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default ChatPhoto;
