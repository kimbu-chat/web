import React, { useCallback, useContext, useEffect } from 'react';
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

	const getPhotos = useActionWithDispatch(ChatActions.getPhoto);
	const selectedChat = useSelector(getSelectedChatSelector);
	const photoForSelectedDialog = selectedChat!.photos;

	const loadMore = useCallback(() => {
		const page: Page = {
			offset: photoForSelectedDialog?.photos!.length || 0,
			limit: 20,
		};

		console.log('called');

		getPhotos({
			page,
			chatId: selectedChat!.id,
		});
	}, [selectedChat!.id, photoForSelectedDialog?.photos]);

	useEffect(() => {
		loadMore();
	}, []);

	const photosWithSeparators = photoForSelectedDialog?.photos.reduce(
		(prevValue, currentValue, currentIndex, array) => {
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
		},
		[] as ChatPhoto.Photo[][],
	);

	return (
		<div className={isDisplayed ? 'chat-photo chat-photo--active' : 'chat-photo'}>
			<div className='chat-photo__top'>
				<button onClick={close} className='chat-photo__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</button>
				<div className='chat-photo__heading'>{t('chatPhoto.photo')}</div>
			</div>
			<InfiniteScroll
				pageStart={0}
				loadMore={loadMore}
				hasMore={photoForSelectedDialog?.hasMore}
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
					<React.Fragment key={photoGroup[0].id + 'group'}>
						<div className='chat-photo__separator'>
							{moment(photoGroup[0].creationDateTime).format('MMMM')}
						</div>
						<div className='chat-photo__photo-list'>
							{photoGroup.map((photo) => (
								<img key={photo.id} className='chat-photo__photo' src={photo.url} alt={photo.alt} />
							))}
						</div>
					</React.Fragment>
				)) || ''}
			</InfiniteScroll>
		</div>
	);
};

export default ChatPhoto;
