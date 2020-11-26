import React, { useEffect, useRef, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './chat.scss';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { MessageList } from 'store/messages/models';
import { MessageActions } from 'store/messages/actions';
import { RootState } from 'store/root-reducer';
import { LocalizationContext } from 'app/app';
import { getSelectedChatSelector, getTypingString } from 'store/chats/selectors';
import MessageItem from '../message-item/message-item';
import InfiniteScroll from 'react-infinite-scroller';
import SelectedMessagesData from '../selected-messages-data/selected-messages-data';
import { setSelectedMessagesLength } from 'store/messages/selectors';
import { MessageUtils } from 'utils/functions/message-utils';
import moment from 'moment';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import { ChatActions } from 'store/chats/actions';

export const MESSAGES_LIMIT = 25;

export const Chat = React.memo(() => {
	const getMessages = useActionWithDispatch(MessageActions.getMessages);
	const markMessagesAsRead = useActionWithDispatch(ChatActions.markMessagesAsRead);

	const { t } = useContext(LocalizationContext);

	const selectedChat = useSelector(getSelectedChatSelector);
	const isSelectState = useSelector(setSelectedMessagesLength) > 0;
	const messageList = useSelector<RootState, MessageList | undefined>((state) =>
		state.messages.messages.find((x: MessageList) => x.chatId == selectedChat?.id),
	);
	const areMessagesLoading = useSelector<RootState, boolean>((state) => state.messages.loading);

	const messages = messageList?.messages;
	const hasMoreMessages = messageList?.hasMoreMessages;

	useEffect(() => {
		if (selectedChat) {
			//fetching first 25messages
			getMessages({
				page: {
					limit: MESSAGES_LIMIT,
					offset: 0,
				},
				chat: selectedChat,
			});
			markAsRead();
		}
	}, [selectedChat?.id]);

	const markAsRead = useCallback((): void => {
		if (selectedChat && (selectedChat.ownUnreadMessagesCount || 0) > 0 && messages) {
			markMessagesAsRead({
				chatId: selectedChat.id,
				lastReadMessageId: messages[0].id,
			});
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
			});
		}
	}, [messages?.length, selectedChat]);

	const messagesContainerRef = useRef(null);

	if (!selectedChat) {
		return (
			<div className='messenger__messages-list'>
				<div className='messenger__select-chat'>{t('chat.select_chat')}</div>
			</div>
		);
	}

	const itemsWithUserInfo = MessageUtils.signAndSeparate(messages || []).reverse();

	return (
		<div className='messenger__messages-list'>
			<div ref={messagesContainerRef} className='messenger__messages-container'>
				{(selectedChat?.typingInterlocutors?.length || 0) > 0 && (
					<div className='messenger__typing-notification'>{getTypingString(t, selectedChat)}</div>
				)}

				{itemsWithUserInfo.length === 0 && !areMessagesLoading && (
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
});
