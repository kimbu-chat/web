import React, { useEffect, useCallback, useRef } from 'react';
import './chat-list.scss';

import ChatFromList from './chat-from-list/chat-from-list';
import InfiniteScroll from 'react-infinite-scroller';

import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { Chat } from 'store/chats/models';
import { RootState } from 'store/root-reducer';
import { ChatActions } from 'store/chats/actions';
import { useParams } from 'react-router';

export const DIALOGS_LIMIT = 25;

export const ChatList = React.memo(() => {
	const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);
	const getChats = useActionWithDispatch(ChatActions.getChats);

	const { chatId } = useParams<{ chatId: string }>();

	const chats = useSelector<RootState, Chat[]>((rootState) => rootState.chats.chats);
	const hasMoreChats = useSelector<RootState, boolean>((rootState) => rootState.chats.hasMore);
	const searchString = useSelector<RootState, string>((rootState) => rootState.chats.searchString);

	useEffect(() => {
		if (chatId) changeSelectedChat(Number(chatId));
		else changeSelectedChat(-1);
	}, [chatId]);

	useEffect(() => {
		getChats({
			page: { offset: 0, limit: DIALOGS_LIMIT },
			initializedBySearch: true,

			name: searchString,
			showOnlyHidden: false,
			showAll: true,
		});
	}, [searchString]);

	const loadPage = useCallback(() => {
		const pageData = {
			limit: 25,
			offset: chats.length,
		};

		getChats({
			page: pageData,
			initializedBySearch: false,
			name: searchString,
			showOnlyHidden: false,
			showAll: true,
		});
	}, [searchString, chats]);

	const chatListRef = useRef(null);

	return (
		<div ref={chatListRef} className='chat-list'>
			{false && (
				<InfiniteScroll
					pageStart={0}
					loadMore={loadPage}
					hasMore={hasMoreChats}
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
					getScrollParent={() => chatListRef.current}
					isReverse={false}
				>
					{chats?.map((chat: Chat) => {
						return <ChatFromList chat={chat} key={chat.id} />;
					})}
				</InfiniteScroll>
			)}

			{chats?.map((chat: Chat) => {
				return <ChatFromList chat={chat} key={chat.id} />;
			})}
		</div>
	);
});
