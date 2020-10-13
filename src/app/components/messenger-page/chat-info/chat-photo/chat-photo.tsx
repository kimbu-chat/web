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

	const photosWithSeparators = photoForSelectedDialog?.photos.map((elem, index, array) => {
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
					{photosWithSeparators?.map((photo) => (
						<React.Fragment key={photo.id}>
							{photo.needToShowSeparator && (
								<div className='chat-photo__separator'>
									{moment(photo.creationDateTime).format('MMMM')}
								</div>
							)}
							<img key={photo.id} className='chat-photo__photo' src={photo.url} alt={photo.alt} />
						</React.Fragment>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default ChatPhoto;
