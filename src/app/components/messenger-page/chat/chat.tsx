import React, { useEffect, useRef, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './chat.scss';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { FileBase, Message, MessageList } from 'app/store/messages/models';
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

export const MESSAGES_LIMIT = 25;

export enum messageFrom {
	me,
	others,
}

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

			//marking as read
			const markAsRead = (): void => {
				const { ownUnreadMessagesCount } = selectedChat;
				if (Boolean(ownUnreadMessagesCount) && (ownUnreadMessagesCount || 0) > 0) {
					markMessagesAsRead(selectedChat);
				}
			};

			markAsRead();
		}
	}, [selectedChat?.id]);

	const loadPage = useCallback(() => {
		const pageData = {
			limit: MESSAGES_LIMIT,
			offset: messages?.length || 0,
		};

		if (selectedChat) {
			getMessages({
				page: pageData,
				chat: selectedChat,
				initiatedByScrolling: false,
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
				fileName: 'calendar-app.zip',
				byteSize: 1342177,
				url: 'https://download.www21.filehosting.org/930dd8c6578ff1067bf88a9929b529b3/UserDL.rar',
				type: FileType.file,
				id: 1,
			},
			{
				fileName: 'blablabla.mp3',
				byteSize: 22777899,
				url: 'https://dll.z1.fm/music/2/14/islam_itljashev_-_na_nervah.mp3?download=force',
				durationInSeconds: 157,
				type: FileType.music,
				id: 3,
			} as FileBase,
			{
				fileName: 'Not displayed',
				byteSize: 2277780099,
				url: 'https://dll.z1.fm/music/4/36/hiti_2020_-_tajpan__agunda_-_luna_ne_znaet_puti.mp3?download=force',
				durationInSeconds: 201,
				type: FileType.recording,
				id: 4,
			} as FileBase,
			{
				fileName: 'Displayed',
				byteSize: 22777780099,
				firstFrameUrl: 'https://i.imgur.com/sxuhpRX_d.webp?maxwidth=728&fidelity=grand',
				url: '',
				durationInSeconds: 228,
				type: FileType.video,
				id: 5,
			} as FileBase,
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
