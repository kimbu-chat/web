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
				fileName: 'Домашка',
				byteSize: 227778,
				url:
					'https://psv4.userapi.com/c856424/u516280711/docs/d9/a8e133a68bf7/Alaman_Mircea_-_Mentananata_-_MI-1.doc',
				type: FileType.file,
			},
			{
				fileName: 'Udemy',
				byteSize: 22777899,
				url:
					'https://psv4.userapi.com/c856424/u516280711/docs/d9/a8e133a68bf7/Alaman_Mircea_-_Mentananata_-_MI-1.doc',
				type: FileType.file,
			},
			{
				fileName: 'app',
				byteSize: 22777899,
				url:
					'https://psv4.userapi.com/c856424/u516280711/docs/d9/a8e133a68bf7/Alaman_Mircea_-_Mentananata_-_MI-1.doc',
				type: FileType.file,
			},
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

				{isSelectState && <SelectedMessagesData />}

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
