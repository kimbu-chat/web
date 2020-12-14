import { ChatActions } from 'store/chats/actions';
import { Page } from 'store/common/models';
import { FriendActions } from 'store/friends/actions';
import { useActionWithDeferred } from 'utils/hooks/use-action-with-deferred';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getMyFriends, getHasMoreFriends, getFriendsLoading } from 'app/store/friends/selectors';
import { InfiniteScroll } from 'app/utils/infinite-scroll/infinite-scroll';
import { Friend } from './friend-from-list/friend';
import './friend-list.scss';

export const FriendList = React.memo(() => {
  const friends = useSelector(getMyFriends);
  const hasMoreFriends = useSelector(getHasMoreFriends);
  const friendsLoading = useSelector(getFriendsLoading);

  const listRef = useRef<HTMLDivElement>(null);

  const loadFriends = useActionWithDeferred(FriendActions.getFriends);
  const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);

  const { chatId } = useParams<{ chatId: string }>();

  useEffect(() => {
    if (chatId) changeSelectedChat(Number(chatId));
    else changeSelectedChat(-1);
  }, [chatId]);

  const loadMore = useCallback(() => {
    const page: Page = {
      offset: friends.length,
      limit: 25,
    };
    loadFriends({ page });
  }, [friends, loadFriends]);

  return (
    <div ref={listRef} className='friend-list'>
      <InfiniteScroll onReachExtreme={loadMore} hasMore={hasMoreFriends} isLoading={friendsLoading}>
        {friends.map((friend) => (
          <Friend key={friend.id} friend={friend} />
        ))}
      </InfiniteScroll>
    </div>
  );
});
