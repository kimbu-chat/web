import { ChatActions } from 'app/store/chats/actions';
import { Page } from 'app/store/common/models';
import { FriendActions } from 'app/store/friends/actions';
import { UserPreview } from 'app/store/my-profile/models';
import { RootState } from 'app/store/root-reducer';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import React, { useCallback, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Friend from './friend-from-list/friend';
import './friend-list.scss';

const FriendList = () => {
	const friends = useSelector<RootState, UserPreview[]>((state) => state.friends.friends);
	const hasMoreFriends = useSelector<RootState, boolean>((state) => state.friends.hasMoreFriends);
	const listRef = useRef<HTMLDivElement>(null);
	const loadFriends = useActionWithDeferred(FriendActions.getFriends);
	const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);

	const { chatId } = useParams<{ chatId: string }>();

	useEffect(() => {
		if (chatId) changeSelectedChat(Number(chatId));
		else changeSelectedChat(-1);
	}, [chatId]);

	const loadMoreFriends = useCallback(() => {
		const page: Page = {
			offset: friends.length,
			limit: 25,
		};
		loadFriends({ page });
	}, [friends, loadFriends]);

	return (
		<div ref={listRef} className='friend-list'>
			<InfiniteScroll
				pageStart={0}
				loadMore={loadMoreFriends}
				hasMore={hasMoreFriends}
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
				getScrollParent={() => listRef.current}
				isReverse={false}
			>
				{friends.map((friend) => (
					<Friend key={friend.id} friend={friend} />
				))}
			</InfiniteScroll>
		</div>
	);
};

export default FriendList;
