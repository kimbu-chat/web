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

	const messagesCopy: Message[] = JSON.parse(JSON.stringify(messages));

	const itemsWithUserInfo = messagesCopy.reverse();

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
						return <MessageItem message={msg} key={msg.id} />;
					})}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default React.memo(Chat);
