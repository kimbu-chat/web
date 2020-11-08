import React, { useEffect, useRef, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './chat.scss';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { Message, MessageList } from 'app/store/messages/models';
import { MessageActions } from 'app/store/messages/actions';
import { RootState } from 'app/store/root-reducer';
import { LocalizationContext } from 'app/app';
import { getSelectedChatSelector, getTypingString } from 'app/store/chats/selectors';
import MessageItem from '../message-item/message-item';
import InfiniteScroll from 'react-infinite-scroller';
import SelectedMessagesData from '../selected-messages-data/selected-messages-data';
import { setSelectedMessagesLength } from 'app/store/messages/selectors';
import { MessageUtils } from 'app/utils/message-utils';
import { FileType } from 'app/store/messages/models';
import moment from 'moment';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import { AudioAttachment, PictureAttachment, RawAttachment, VideoAttachment } from 'app/store/chats/models';

export const MESSAGES_LIMIT = 25;

const Chat = () => {
	const getMessages = useActionWithDispatch(MessageActions.getMessages);
	const markMessagesAsRead = useActionWithDispatch(MessageActions.markMessagesAsRead);

	const { t } = useContext(LocalizationContext);

	const selectedChat = useSelector(getSelectedChatSelector);
	const messages = useSelector<RootState, Message[]>(
		(state) =>
			state.messages.messages.find((x: MessageList) => x.chatId == selectedChat?.id)?.messages as Message[],
	);
	const hasMoreMessages = useSelector<RootState, boolean>(
		(state) =>
			state.messages.messages.find((x: MessageList) => x.chatId == selectedChat?.id)?.hasMoreMessages as boolean,
	);
	const isSelectState = useSelector(setSelectedMessagesLength) > 0;

	useEffect(() => {
		if (selectedChat) {
			//fetching first 25messages
			getMessages({
				page: {
					limit: MESSAGES_LIMIT,
					offset: 0,
				},
				chat: selectedChat,
				initiatedByScrolling: false,
			});
			markAsRead();
		}
	}, [selectedChat?.id]);

	const markAsRead = useCallback((): void => {
		const { ownUnreadMessagesCount } = selectedChat!;
		if (Boolean(ownUnreadMessagesCount) && (ownUnreadMessagesCount || 0) > 0) {
			markMessagesAsRead(selectedChat!);
		}
	}, [selectedChat]);

	const loadPage = useCallback(() => {
		const pageData = {
			limit: MESSAGES_LIMIT,
			offset: messages?.length || 0,
		};

		if (selectedChat) {
			getMessages({
				page: pageData,
				chat: selectedChat,
				initiatedByScrolling: true,
			});
		}
	}, [messages?.length, selectedChat]);

	const messagesContainerRef = useRef(null);

	if (!selectedChat || !messages) {
		return <div className='messenger__messages-list'></div>;
	}

	const itemsWithUserInfo = MessageUtils.signAndSeparate(messages || []).reverse();

	//!HARDCODE - remove in deploy
	itemsWithUserInfo[itemsWithUserInfo.length - 1] = {
		...itemsWithUserInfo[itemsWithUserInfo.length - 1],
		attachments: [
			{
				title: 'calendar-ap.zip',
				byteSize: 1342177,
				url:
					'https://kimbu-bucket.s3.eu-west-3.amazonaws.com/kimbu-bucket/2020/11/07/58a1008852a54f1b823e2d8791e658cf',
				type: FileType.file,
				id: '1',
			} as RawAttachment,
			{
				title: 'blablabla.mp3',
				byteSize: 22777899,
				url: 'https://dll.z1.fm/music/2/14/islam_itljashev_-_na_nervah.mp3?download=force',
				duration: 157,
				type: FileType.music,
				id: '3',
			} as AudioAttachment,
			{
				title: 'blablabla.mp3',
				byteSize: 22777899,
				url: 'https://dll.z1.fm/music/2/14/islam_itljashev_-_na_nervah.mp3?download=force',
				duration: 157,
				type: FileType.music,
				id: '395',
			} as AudioAttachment,
			{
				title: 'Not displayed',
				byteSize: 2277780099,
				url: 'https://dll.z1.fm/music/4/36/hiti_2020_-_tajpan__agunda_-_luna_ne_znaet_puti.mp3?download=force',
				duration: 201,
				type: FileType.recording,
				id: '4',
			} as AudioAttachment,
			{
				title: 'Displayed',
				name: 'Displayed',
				byteSize: 22777780099,
				firstFrameUrl: 'https://zvuk-m.com/wp-content/uploads/2020/08/7459378-1068x556.jpg',
				url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
				duration: 228,
				type: FileType.video,
				id: '5',
			} as VideoAttachment,
			{
				title: 'Displayed',
				byteSize: 22777780099,
				url:
					'https://avatars.mds.yandex.net/get-zen_doc/1641493/pub_5d24a067a2d6ed00ad034894_5d24a368a98a2a00ade706b2/scale_1200',
				previewUrl:
					'https://avatars.mds.yandex.net/get-zen_doc/1641493/pub_5d24a067a2d6ed00ad034894_5d24a368a98a2a00ade706b2/scale_1200',
				type: FileType.photo,
				id: '6',
			} as PictureAttachment,
			{
				title: 'Displayed',
				name: 'Displayed',
				byteSize: 22777780099,
				firstFrameUrl: 'https://i.ytimg.com/vi/RqT9szfGEDw/maxresdefault.jpg',
				url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
				duration: 228,
				type: FileType.video,
				id: '14',
			} as VideoAttachment,
		],
	};

	return (
		<div className='messenger__messages-list'>
			<div ref={messagesContainerRef} className='messenger__messages-container'>
				{selectedChat?.typingInterlocutors.length > 0 && (
					<div className='messenger__typing-notification'>{getTypingString(t, selectedChat)}</div>
				)}

				{itemsWithUserInfo.length === 0 && (
					<div className='messenger__messages-list__empty'>
						<p>{t('chat.empty')}</p>
					</div>
				)}

				<FadeAnimationWrapper isDisplayed={isSelectState}>
					<SelectedMessagesData />
				</FadeAnimationWrapper>

				<InfiniteScroll
					pageStart={0}
					loadMore={loadPage}
					hasMore={hasMoreMessages}
					initialLoad={false}
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
					getScrollParent={() => messagesContainerRef.current}
					isReverse={true}
				>
					{itemsWithUserInfo.map((msg) => {
						return (
							<React.Fragment key={msg.id}>
								{msg.needToShowDateSeparator && (
									<div className='message__separator message__separator--capitalized'>
										<span>
											{moment
												.utc(msg.creationDateTime)
												.local()
												.format('dddd, MMMM D, YYYY')
												.toString()}
										</span>
									</div>
								)}
								<MessageItem message={msg} key={msg.id} />
							</React.Fragment>
						);
					})}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default React.memo(Chat);
