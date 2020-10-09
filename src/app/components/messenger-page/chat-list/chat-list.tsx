import React, { useEffect, useCallback, useRef } from 'react';
import './chat-list.scss';

import ChatFromList from '../chat-from-list/chat-from-list';
import InfiniteScroll from 'react-infinite-scroller';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { Chat } from 'app/store/chats/models';
import { RootState } from 'app/store/root-reducer';
import { ChatActions } from 'app/store/chats/actions';

export const DIALOGS_LIMIT = 25;

const ChatList = () => {
	const getChats = useActionWithDispatch(ChatActions.getChats);

	const chats = useSelector<RootState, Chat[]>((rootState) => rootState.chats.chats);
	const hasMoreChats = useSelector<RootState, boolean>((rootState) => rootState.chats.hasMore);
	const searchString = useSelector<RootState, string>((rootState) => rootState.chats.searchString);

	useEffect(() => {
		getChats({
			page: { offset: 0, limit: DIALOGS_LIMIT },
			initializedBySearch: true,
			initiatedByScrolling: false,
			name: searchString,
			showOnlyHidden: false,
			showAll: true,
		});
	}, [searchString]);

	const loadPage = useCallback(() => {
		const pageData = {
			limit: 25,
			offset: DIALOGS_LIMIT,
		};

		getChats({
			page: pageData,
			initializedBySearch: false,
			initiatedByScrolling: true,
			name: searchString,
			showOnlyHidden: false,
			showAll: true,
		});
	}, [searchString, chats]);

	const chatListRef = useRef(null);

	return (
		<div ref={chatListRef} className='chat-list'>
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
		</div>
	);
};

export default React.memo(ChatList);
