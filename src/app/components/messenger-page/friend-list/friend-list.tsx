import { IPage } from 'app/store/common/models';
import { FriendActions } from 'store/friends/actions';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getMyFriendsSelector, getHasMoreFriendsSelector, getFriendsLoadingSelector } from 'app/store/friends/selectors';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { FRIENDS_LIMIT } from 'app/utils/pagination-limits';
import './friend-list.scss';
import { Friend } from './friend-from-list/friend';

export const FriendList = React.memo(() => {
  const friends = useSelector(getMyFriendsSelector);
  const hasMoreFriends = useSelector(getHasMoreFriendsSelector);
  const friendsLoading = useSelector(getFriendsLoadingSelector);

  const loadFriends = useActionWithDeferred(FriendActions.getFriends);

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
