import { IPage } from 'store/common/models';
import { FriendActions } from 'store/friends/actions';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getMyFriends, getHasMoreFriends, getFriendsLoading } from 'app/store/friends/selectors';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { FRIENDS_LIMIT } from 'app/utils/pagination-limits';
import { getSelectedChatIdSelector } from 'app/store/chats/selectors';
import './friend-list.scss';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { ChatActions } from 'app/store/chats/actions';
import { useParams } from 'react-router';
import { Friend } from './friend-from-list/friend';

export const FriendList = React.memo(() => {
  const friends = useSelector(getMyFriends);
  const hasMoreFriends = useSelector(getHasMoreFriends);
  const friendsLoading = useSelector(getFriendsLoading);
  const selectedChatId = useSelector(getSelectedChatIdSelector);

  const loadFriends = useActionWithDeferred(FriendActions.getFriends);
  const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);

  const { chatId } = useParams<{ chatId: string }>();

  useEffect(() => {
    if (chatId) {
      changeSelectedChat({ newChatId: Number(chatId), oldChatId: selectedChatId });
    }
  }, [chatId]);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: friends.length,
      limit: FRIENDS_LIMIT,
    };
    loadFriends({ page });
  }, [friends, loadFriends]);

  return (
    <div className='friend-list'>
      <InfiniteScroll onReachExtreme={loadMore} hasMore={hasMoreFriends} isLoading={friendsLoading}>
        {friends.map((friend) => (
          <Friend key={friend.id} friend={friend} />
        ))}
      </InfiniteScroll>
    </div>
  );
});
